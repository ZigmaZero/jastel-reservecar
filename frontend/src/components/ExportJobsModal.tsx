import React, { useState } from "react";
import {
    Drawer,
    Typography,
    Divider,
    Button,
    Stack,
    Box
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface ExportJobsModalProps {
    onClose: () => void;
    onExport: (startTime: string, endTime: string) => void;
}

const ExportJobsModal: React.FC<ExportJobsModalProps> = ({ onClose, onExport }) => {
    const [formData, setFormData] = useState<{ startTime: Dayjs | null; endTime: Dayjs | null }>({
        startTime: null,
        endTime: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onExport(
            formData.startTime ? formData.startTime.toISOString() : "",
            formData.endTime ? formData.endTime.toISOString() : ""
        );
        onClose();
    };

    return (
        <Drawer anchor="top" open onClose={onClose}>
            <Box sx={{ width: "100%", maxWidth: 500, mx: "auto", p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Export Reservations
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <form onSubmit={handleSubmit}>
                    <Stack direction={"row"} spacing={2}>
                        <DateTimePicker
                            label="Start Time"
                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                            value={formData.startTime}
                            onChange={value => setFormData(prev => ({ ...prev, startTime: value }))}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true
                                }
                            }}
                        />
                        <DateTimePicker
                            label="End Time"
                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                            value={formData.endTime}
                            onChange={value => setFormData(prev => ({ ...prev, endTime: value }))}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true
                                }
                            }}
                        />
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button onClick={onClose} color="secondary" variant="outlined">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Export
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Drawer>
    );
};

export default ExportJobsModal;