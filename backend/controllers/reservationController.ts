import AuthenticatedRequest from "../interfaces/authenticatedRequest.js";
import logger from "../logger.js";
import { updateReservation, getReservationById, getReservationsBetweenTime, getReservationsCount, getReservations } from "../services/reservationService.js";
import { Response } from 'express'; 

export function reservationUpdateController() {
  return (req: AuthenticatedRequest, res: Response) => {
    const reservationId = parseInt(req.params.reservationId, 10);
    const { checkinTime, checkoutTime } = req.body;

    if (isNaN(reservationId) || !Number.isInteger(reservationId)) {
      res.status(400).json({ error: 'Invalid reservationId. It must be an integer.' });
      return;
    }

    // Validate checkinTime and checkoutTime
    const isValidIsoString = (value: any) => typeof value === "string" &&
      value.length > 0 &&
      !isNaN(Date.parse(value)) &&
      value === new Date(value).toISOString();

    if (checkinTime === undefined ||
      checkinTime === null ||
      checkinTime === "" ||
      !isValidIsoString(checkinTime)) {
      res.status(400).json({ error: "Invalid checkinTime. Must be a valid ISO string." });
      return;
    }

    if (checkoutTime === undefined ||
      checkoutTime === null ||
      checkoutTime === "" ||
      !isValidIsoString(checkoutTime)) {
      res.status(400).json({ error: "Invalid checkoutTime. Must be a valid ISO string." });
      return;
    }

    try {
      const result = updateReservation(reservationId, checkinTime, checkoutTime);
      if (result.changes === 0) {
        res.status(404).json({ error: 'Reservation not found.' });
        return;
      }
      res.status(200).json({ message: "Reservation updated successfully." });
    } catch (error) {
      logger.error("Error updating reservation:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function reservationGetByIdController() {
  return (req: AuthenticatedRequest, res: Response) => {
    const reservationId = parseInt(req.params.reservationId, 10);

    if (isNaN(reservationId) || !Number.isInteger(reservationId)) {
      res.status(400).json({ error: 'Invalid reservationId. It must be an integer.' });
      return;
    }

    try {
      const reservation = getReservationById(reservationId);

      if (!reservation) {
        res.status(404).json({ error: 'Reservation not found.' });
        return;
      }

      res.status(200).json(reservation);
    } catch (error) {
      logger.error("Error fetching reservation:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function reservationExportController() {
  return (req: AuthenticatedRequest, res: Response) => {
    const startTime = req.query.startTime
      ? new Date(req.query.startTime as string)
      : new Date('1970-01-01T00:00:00.000Z');
    const endTime = req.query.endTime
      ? new Date(req.query.endTime as string)
      : new Date('9999-12-31T23:59:59.999Z');

    const reservations = getReservationsBetweenTime(startTime, endTime);
    res.status(200).json(reservations.map(reservation => ({
      id: reservation.id,
      userId: reservation.userId,
      user: reservation.user,
      carId: reservation.carId,
      car: reservation.car,
      teamName: reservation.teamName,
      description: reservation.description,
      checkinTime: new Date(reservation.checkinTime).toLocaleString(),
      checkoutTime: reservation.checkoutTime ? new Date(reservation.checkoutTime).toLocaleString() : undefined
    })));
  };
}

export function reservationGetPaginatedController() {
  return (req: AuthenticatedRequest, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    const sortField = req.query.sortField ? req.query.sortField as string : undefined;
    const sortOrder = req.query.sortOrder ? req.query.sortOrder as string : undefined;
    const filterField = req.query.filterField ? req.query.filterField as string : undefined;
    const filterOp = req.query.filterOp ? req.query.filterOp as string : undefined;
    const filterValue = req.query.filterValue ? req.query.filterValue as string : undefined;

    if (page < 0 || pageSize < 1) {
      res.status(400).json({ error: 'Invalid page or pageSize.' });
      return;
    }
    const offset = page * pageSize;

    if (sortField !== "id" &&
      sortField !== "userId" &&
      sortField !== "user" &&
      sortField !== "carId" &&
      sortField !== "car" &&
      sortField !== "teamName" &&
      sortField !== "description" &&
      sortField !== "checkinTime" &&
      sortField !== "checkoutTime" &&
      sortField !== undefined) {
      res.status(400).json({
        error: 'Invalid sortField.'
      });
      return;
    }

    if (sortOrder !== "asc" && sortOrder !== "desc" && sortOrder !== undefined) {
      res.status(400).json({ error: 'Invalid sortOrder.' });
      return;
    }

    if (filterField !== "id" &&
      filterField !== "userId" &&
      filterField !== "user" &&
      filterField !== "carId" &&
      filterField !== "car" &&
      filterField !== "teamName" &&
      filterField !== "description" &&
      filterField !== "checkinTime" &&
      filterField !== "checkoutTime" &&
      filterField !== undefined) {
      res.status(400).json({
        error: 'Invalid filterField.'
      });
      return;
    }

    if (filterOp !== "=" &&
      filterOp !== "contains" &&
      filterOp !== "onOrBefore" &&
      filterOp !== "onOrAfter" &&
      filterOp !== "isEmpty" &&
      filterOp !== "isNotEmpty" &&
      filterOp !== undefined) {
      res.status(400).json({
        error: 'Invalid filterOp.'
      });
      return;
    }

    if (filterField === "id" || filterField === "userId" || filterField === "carId") {
      if (filterOp !== "=") {
        res.status(400).json({
          error: 'Invalid filterOp.'
        });
        return;
      }
    }

    if (filterField === "car" || filterField === "user" || filterField === "teamName" || filterField === "description") {
      if (filterOp !== "contains") {
        res.status(400).json({
          error: 'Invalid filterOp.'
        });
        return;
      }
    }

    if (filterField === "checkinTime" && filterOp !== "onOrAfter" && filterOp !== "onOrBefore") {
      res.status(400).json({
        error: 'Invalid filterOp.'
      });
      return;
    }

    if (filterField === 'checkoutTime' && filterOp !== "onOrAfter" && filterOp !== "onOrBefore"
      && filterOp !== "isEmpty" && filterOp !== "isNotEmpty") {
      res.status(400).json({
        error: 'Invalid filterOp.'
      });
    }

    try {
      const total = getReservationsCount(filterField, filterOp, filterValue);
      const reservations = getReservations(pageSize, offset, sortField, sortOrder, filterField, filterOp, filterValue);

      res.status(200).json({
        data: reservations,
        total,
        page,
        pageSize,
        maxPages: Math.max(1, Math.ceil(total / pageSize))
      });
    } catch (error) {
      logger.error("Error fetching reservations:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
