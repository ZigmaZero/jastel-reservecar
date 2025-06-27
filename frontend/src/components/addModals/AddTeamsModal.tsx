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

interface AddTeamsModalProps {
  onClose: () => void;
  onAdd?: (item: TeamExternal) => void;
}

const AddTeamsModal: React.FC<AddTeamsModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<TeamExternal>({ name: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }) as TeamExternal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAdd) onAdd(formData);
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Add Team</DialogTitle>
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

export default AddTeamsModal;