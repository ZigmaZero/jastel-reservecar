import AuthenticatedRequest from "../interfaces/authenticatedRequest.js";
import logger from "../logger.js";
import jobCheckinMessage from "../messages/jobCheckinMessage.js";
import jobCheckoutMessage from "../messages/jobCheckoutMessage.js";
import { getCarsByTeam, getCarById } from "../services/carService.js";
import { getEmployeeById, getEmployeeByLineId, createEmployee } from "../services/employeeService.js";
import { message, messageGroup } from "../services/lineService.js";
import { getReservationByUser, getReservationById, checkoutReservation, createReservation, updateReservationDescription } from "../services/reservationService.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import { Request, Response } from "express";

export function userGetReservationsController() {
  return (req: AuthenticatedRequest, res: Response) => {
    const userId = req.employee?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const reservations = getReservationByUser(userId);
      if (!reservations || reservations.length === 0) {
        res.status(200).json({ reservations: [] });
        return;
      }
      res.status(200).json({ reservations: reservations });
    } catch (error) {
      logger.error("Error fetching reservations:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function userGetCarsController() {
  return (req: AuthenticatedRequest, res: Response) => {

    const userId = req.employee?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const user = getEmployeeById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
      const teamId = req.query.teamId ? parseInt(req.query.teamId as string, 10) : user.teamId;

      if (!teamId) {
        res.status(200).json({ cars: [] });
        return;
      }

      // Get cars based on user's team
      const cars = user.teamId ? getCarsByTeam(teamId) : []; // Assuming getCarById can take teamId
      if (!cars || cars.length === 0) {
        res.status(200).json({ cars: [] });
        return;
      }

      res.status(200).json({ cars: cars });
    } catch (error) {
      logger.error("Error fetching cars:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function userCheckoutController() {
  return (req: AuthenticatedRequest, res: Response) => {
    const { reservationId, description } = req.body;
    const employee = req.employee;
    if (!employee) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = employee.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const checkoutTime = new Date().toISOString();

    // Input validation
    if (typeof reservationId !== 'number' || !Number.isInteger(reservationId)) {
      res.status(400).json({ error: 'Invalid reservationId. It must be an integer.' });
      return;
    }

    // Check if reservation exists
    const reservation = getReservationById(reservationId);
    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found.' });
      return;
    }

    // Check if the reservation belongs to the user
    if (reservation.userId !== userId) {
      res.status(403).json({ error: 'Forbidden.' });
      return;
    }

    // Check if the reservation is already checked out
    if (reservation.checkoutTime) {
      res.status(400).json({ error: 'Reservation already checked out.' });
      return;
    }

    try {
      // If description is provided and different, update it before checkout
      if (typeof description === 'string' && description.trim() !== '' && description !== reservation.description) {
        updateReservationDescription(reservationId, description);
      }
      const checkoutResult = checkoutReservation(reservationId, checkoutTime);
      if (!checkoutResult || checkoutResult.changes === 0) {
        logger.error(`Checkout failed: No rows updated for reservationId ${reservationId}`);
        res.status(500).json({ error: 'Failed to checkout reservation.' });
        return;
      }

      return message(employee.lineId, jobCheckoutMessage(reservation)).then((result) => {
        if (result.success) {
          // If message sent successfully
          res.status(200).json({ message: 'Checkout successful.', line: result.message });
          return;
        }
        // If message failed to send
        res.status(200).json({
          message: 'Checkout successful.',
          line: `Failed with status ${result.status} and error ${result.error}`
        });
        return;
      });
    } catch (error) {
      logger.error("Error during checkout:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function userCheckinController() {
  return (req: AuthenticatedRequest, res: Response) => {
    const { carId, description } = req.body;
    const userId = req.employee?.userId;
    const checkinTime = new Date().toISOString();

    // Input validation
    if (typeof userId !== 'number' ||
      typeof carId !== 'number' ||
      typeof description !== 'string' ||
      description.trim() === '' ||
      !Number.isInteger(userId) ||
      !Number.isInteger(carId)) {
      res.status(400).json({ error: 'Invalid User or Car.' });
      return;
    }

    // Check if user exists
    const user = getEmployeeById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Check if car exists
    const car = getCarById(carId);
    if (!car) {
      res.status(404).json({ error: 'Car not found.' });
      return;
    }

    let result;
    try {
      result = createReservation(userId, carId, description, checkinTime);
    } catch (error) {
      logger.error("Error during reservation creation:", error);
      res.status(500).json({ error: 'Failed to create reservation.' });
      return;
    }

    if (!result || !result.lastInsertRowid) {
      logger.error("Reservation creation returned invalid result:", result);
      res.status(500).json({ error: 'Failed to create reservation.' });
      return;
    }

    let reservation;
    try {
      logger.info(`Attempting to retrieve reservation with id: ${result.lastInsertRowid}`);
      reservation = getReservationById(result.lastInsertRowid as number);
    } catch (error) {
      logger.error(`Error during reservation retrieval for id ${result.lastInsertRowid}:`, (error && (error as any).stack) ? (error as any).stack : error);
      res.status(500).json({ error: 'Failed to create reservation.' });
      return;
    }

    if (!reservation) {
      logger.error(`Reservation retrieval returned undefined for id: ${result.lastInsertRowid}`);
      res.status(500).json({ error: 'Failed to create reservation.' });
      return;
    }

    // Send message to user
    message(user.lineId, jobCheckinMessage(reservation)).then((userResult) => {
      // Send message to group
      messageGroup(jobCheckinMessage(reservation)).then((groupResult) => {
        if (groupResult.success) {
          res.status(201).json({
            success: true,
            line: groupResult.message
          });
          return;
        } else {
          logger.error("Error during group message sending:", groupResult);
          res.status(201).json({
            success: true,
            line: `Failed with status ${groupResult.status} and error ${groupResult.error}`
          });
          return;
        }
      }).catch((error) => {
        logger.error("Exception during group message sending:", error);
        res.status(201).json({
          success: false,
          line: 'Exception during group message sending.'
        });
      });
    }).catch((error) => {
      logger.error("Exception during user message sending:", error);
      res.status(201).json({
        success: false,
        line: 'Exception during user message sending.'
      });
    });
  };
}

export function userLoginController() {
  return (req: Request, res: Response) => {
    // TODO: after LINE Login, get userId from LINE API instead.
    const { lineId } = req.body;
    // Input validation
    if (typeof lineId !== 'string' || lineId.trim() === '') {
      res.status(400).json({ error: 'Invalid fullName. It must be a non-empty string.' });
      return;
    }
    // Check if user exists
    try {
      // TODO: change to lineId based verification
      const user = getEmployeeByLineId(lineId);
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
      // Generate JWT token
      const token = generateAccessToken(user);

      res.status(200).json({ success: true, token: token, user: user });
    } catch (error) {
      logger.error("Error during login:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function userRegisterController() {
  return (req: Request, res: Response) => {
    const { fullName, lineId } = req.body;
    // Input validation
    if (typeof fullName !== 'string' || fullName.trim() === '') {
      res.status(400).json({ error: 'Invalid fullName. It must be a non-empty string.' });
      return;
    }

    if (typeof lineId !== 'string' || lineId.trim() === '') {
      res.status(400).json({ error: 'Invalid fullName. It must be a non-empty string.' });
      return;
    }

    // Enter user to database
    try {
      const result = createEmployee(fullName.trim(), lineId);
      if (!result || !result.lastInsertRowid) {
        res.status(500).json({ error: 'Failed to register user.' });
        return;
      }

      res.status(201).json({ success: true });
    } catch (error) {
      logger.error("Error during registration:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
