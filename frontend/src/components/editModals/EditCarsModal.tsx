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

interface EditCarsModalProps {
  item: CarExternal;
  onClose: () => void;
  onEdit: (originalItem: CarExternal, updatedItem: CarExternal | null) => void;
}

const EditCarsModal: React.FC<EditCarsModalProps> = ({ item, onClose, onEdit }) => {
  const { token } = useAdmin();
  const [formData, setFormData] = useState<CarExternal>({ ...item });
  const [teams, setTeams] = useState<TeamExternal[]>([]);

  useEffect(() => {
    if (!token) {
      onClose();
      return;
    }
    getTeams(token)
      .then((teamsList: TeamExternal[]) => {
        setTeams(teamsList);
        if (formData.teamId) {
          // Ensure the selected team is still valid
          const teamExists = teamsList.some(team => team.id === formData.teamId);
          if (!teamExists) {
            setFormData(prev => ({ ...prev, teamId: undefined }));
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        alert("ไม่สามารถโหลดส่วนงานได้ กรุณาลองใหม่ภายหลัง");
        onClose();
      });
    // eslint-disable-next-line
  }, [token]);

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
    onEdit(item, formData);
    onClose();
  };

  const handleDelete = () => {
    onEdit(item, null);
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>แก้ไขข้อมูลรถ</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="เลขทะเบียนรถ"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChangePlate}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel id="team-label">ส่วนงาน</InputLabel>
              <Select
                labelId="team-label"
                name="teamId"
                value={formData.teamId?.toString() ?? ""}
                label="Team"
                onChange={handleChangeTeam}
              >
                <MenuItem value="">
                  <em>เลือกส่วนงาน</em>
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
            Save
          </Button>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCarsModal;