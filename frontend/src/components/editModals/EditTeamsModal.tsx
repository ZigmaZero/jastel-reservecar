import React, { useState } from "react";
import type { TeamExternal } from "../../types/externalTypes";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from "@mui/material";

interface EditModalProps {
  item: TeamExternal;
  onClose: () => void;
  onEdit: (originalItem: TeamExternal, updatedItem: TeamExternal | null) => void;
}

const EditTeamsModal: React.FC<EditModalProps> = ({ item, onClose, onEdit }) => {
  const [formData, setFormData] = useState<TeamExternal>({ ...item });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }) as TeamExternal);
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
      <DialogTitle>แก้ไขข้อมูลส่วนงาน</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="ชื่อส่วนงาน"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
              fullWidth
            />
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

export default EditTeamsModal;