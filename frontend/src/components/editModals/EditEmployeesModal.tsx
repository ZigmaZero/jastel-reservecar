import React, { useState, useEffect } from "react";
import type { EmployeeExternal, TeamExternal } from "../../types/externalTypes";
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
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface EditEmployeesModalProps {
  item: EmployeeExternal;
  onClose: () => void;
  onEdit: (originalItem: EmployeeExternal, updatedItem: EmployeeExternal | null) => void;
}

const EditEmployeesModal: React.FC<EditEmployeesModalProps> = ({ item, onClose, onEdit }) => {
  const [formData, setFormData] = useState<EmployeeExternal>({ ...item });
  const { token } = useAdmin();
  const [teams, setTeams] = useState<TeamExternal[]>([]);

  useEffect(() => {
    if (!token) {
      onClose();
      return;
    }
    getTeams(token)
      .then((teamsList: TeamExternal[]) => {
        setTeams(teamsList);
        // Ensure the selected team is still valid
        if (formData.teamId) {
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

  const originallyVerified = item.verified;

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleChangeVerified = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      verified: e.target.checked
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
      <DialogTitle>แก้ไขข้อมูลผู้ใช้งาน</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="ชื่อผู้ใช้งาน"
              name="name"
              value={formData.name}
              onChange={handleChangeName}
              required
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChangeVerified}
                  disabled={originallyVerified}
                />
              }
              label="การรับรอง"
            />
            <Typography variant="caption" color="text.secondary">
              (ผู้ใช้งานที่ได้รับการรับรองไม่สามารถเปลี่ยนแปลงสถานะการรับรองได้)
            </Typography>
            <FormControl fullWidth required>
              <InputLabel id="team-label">ส่วนงาน</InputLabel>
              <Select
                labelId="team-label"
                name="teamId"
                value={formData.teamId?.toString() ?? ""}
                label="ส่วนงาน"
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

export default EditEmployeesModal;