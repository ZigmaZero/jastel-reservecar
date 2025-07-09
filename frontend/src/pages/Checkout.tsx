import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import getJobsOfUser from "../api/reservations/getJobsOfUser";
import type { ReservationExternal } from "../types/externalTypes";
import userCheckout from "../api/user/userCheckout";
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

const Checkout = () => {
  const { user, token } = useUser();
  const [jobId, setJobId] = useState<number | "">("");
  const [jobs, setJobs] = useState<ReservationExternal[]>([]);
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.verified || !token) {
      navigate("/line/access");
      return;
    }
    
    getJobsOfUser(token)
    .then((jobsList) => {
      setJobs(jobsList);
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        alert("คุณต้องเข้าสู่ระบบก่อนทำการ Checkout")
        navigate("/login")
      } else if (error.response && error.response.status !== 404 && error.response.status !== 400) {
        console.error("Unexpected error status:", error.response.status, error.response.data);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูลงาน กรุณาลองใหม่ภายหลัง");
      }
      setJobs([]); // Clear job options on error
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("คุณต้องเข้าสู่ระบบก่อนทำการ Checkout");
      return;
    }
    userCheckout(jobId as number, token, description)
      .then(() => {
        navigate("/checkout-success");
      })
      .catch((error) => {
        console.error("Checkout error:", error);
        alert("ไม่สามารถทำการ Checkout ได้ กรุณาลองใหม่ภายหลัง");
      });
  };

  return (
    <>
      <Navbar showButtons={user !== null} />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Checkout
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth required sx={{ mb: 3 }}>
              <InputLabel id="job-label">เลขงาน</InputLabel>
              <Select
                labelId="job-label"
                id="job"
                value={jobId}
                label="เลขงาน"
                onChange={(e) => setJobId(Number(e.target.value))}
              >
                {jobs.map((j) => (
                  <MenuItem key={j.id} value={j.id} sx={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}>
                    [{j.car} @{" "}
                    {new Date(j.checkinTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}{" "}
                    | {j.description}]
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="แก้ไขรายละเอียดงาน (ถ้าต้องการ)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!jobId}
            >
              Checkout
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Checkout;