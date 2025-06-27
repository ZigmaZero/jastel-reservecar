import React, { useState } from "react";
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
  item: string; // old admin name
  onClose: () => void;
  onEdit: (updatedItem: { name: string; password: string } | null) => void;
}

const EditAdminModal: React.FC<EditModalProps> = ({ item, onClose, onEdit }) => {
  const [formData, setFormData] = useState<{ name: string; password: string }>({
    name: item,
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(formData);
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Admin</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="new-password"
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAdminModal;