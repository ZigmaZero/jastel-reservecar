import React, { useEffect, useState } from "react";
import type { CarExternal, TeamExternal } from "../../types/externalTypes";
import getTeams from "../../api/teams/getTeams";
import { useAdmin } from "../../contexts/AdminContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

interface AddCarsModalProps {
  onClose: () => void;
  onAdd?: (item: CarExternal) => void;
}

const AddCarsModal: React.FC<AddCarsModalProps> = ({ onClose, onAdd }) => {
  const { token } = useAdmin();
  const [formData, setFormData] = useState<CarExternal>({ plateNumber: "" });
  const [teams, setTeams] = useState<TeamExternal[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }
    getTeams(token)
      .then((teamsList: TeamExternal[]) => {
        setTeams(teamsList);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        alert("Failed to load teams. Please try again later.");
        onClose();
      });
  }, [token, onClose]);

  const handleChangePlate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      plateNumber: e.target.value
    }));
  };

  const handleChangeTeam = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      teamId: value === "" ? undefined : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAdd) onAdd(formData);
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Add Car</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Plate No."
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChangePlate}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel id="team-label">Team</InputLabel>
              <Select
                labelId="team-label"
                name="teamId"
                value={formData.teamId?.toString() ?? ""}
                label="Team"
                onChange={handleChangeTeam}
              >
                <MenuItem value="">
                  <em>Select a team</em>
                </MenuItem>
                {teams.map(team => (
                  <MenuItem key={team.id?.toString()} value={team.id?.toString()}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
          <Button type="button" onClick={onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCarsModal;