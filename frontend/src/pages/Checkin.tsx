import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import getTeams from "../api/teams/getTeams";
import type { CarExternal, TeamExternal } from "../types/externalTypes";
import getCarsOfTeam from "../api/cars/getCarsOfTeam";
import userCheckin from "../api/user/userCheckin";
import {
  Container,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  TextField
} from "@mui/material";

const Checkin = () => {
  const { user, token } = useUser();
  const [description, setDescription] = useState<string>("");
  const [cars, setCars] = useState<CarExternal[]>([]);
  const [carId, setCarId] = useState<number | "">("");
  const [teams, setTeams] = useState<TeamExternal[]>([]);
  const [teamId, setTeamId] = useState<number | "">("");
  const navigate = useNavigate();

  // Initialize team options and set default selection to user's team
  useEffect(() => {
    if (!user || !user.verified || !token) {
      navigate("/line/access");
      return;
    }
    getTeams(token).then((teamsList: TeamExternal[]) => {
      setTeams(teamsList);
      // Set default selection to user's teamId if present
      if (user.teamId && teamsList.some(t => t.id === user.teamId)) {
        setTeamId(user.teamId);
      } else {
        setTeamId("");
      }
    });
  }, [token, navigate]);

  // When the teamId changes, update the car options
  useEffect(() => {
    if (teamId && token) {
      getCarsOfTeam(teamId, token)
        .then((carsList) => {
          setCars(carsList);
        }).catch((error) => {
          console.error("Error fetching cars:", error);
          setCars([]); // Clear car options on error
          alert("Failed to load cars. Please try again later.");
        });
      setCarId(""); // Reset car selection
    } else {
      setCars([]); // Clear car options if no team is selected
      setCarId(""); // Reset car selection
    }
  }, [token, teamId]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("You have been logged out. Please log in again.");
      navigate("/login");
      return;
    }
    userCheckin(carId as number, description, token)
      .then(() => {
        navigate("/checkin-success");
      })
      .catch((error) => {
        console.error("Checkin failed:", error);
        alert("Checkin failed. Please try again later.");
      });
  };

  return (
    <>
      <Navbar showButtons={user !== null} />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Checkin
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Team Selection */}
            <FormControl fullWidth required sx={{ mb: 3 }}>
              <InputLabel id="team-label">รถประจำส่วนงาน</InputLabel>
              <Select
                labelId="team-label"
                id="team"
                value={teamId}
                label="รถประจำส่วนงาน"
                onChange={(e) => setTeamId(Number(e.target.value))}
              >
                {teams.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Car Selection */}
            <FormControl fullWidth required sx={{ mb: 3 }}>
              <InputLabel id="car-label">เลขทะเบียนรถ</InputLabel>
              <Select
                labelId="car-label"
                id="car"
                value={carId}
                label="เลขทะเบียนรถ"
                onChange={(e) => setCarId(Number(e.target.value))}
              >
                {cars.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.plateNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description */}
            <TextField
              id="description"
              label="รายละเอียดงาน"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!teamId || !carId || !description}
            >
              Checkin
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Checkin;