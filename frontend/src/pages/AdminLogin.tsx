import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLogin from "../api/admin/adminLogin";
import { useAdmin } from "../contexts/AdminContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box
} from "@mui/material";

const AdminLogin = () => {
  const { admin, setAdmin, setToken } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // if is admin, redirect to dashboard
  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard");
    }
  }, [admin, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // login API
    adminLogin(username, password)
      .then((data) => {
        setAdmin(data.admin);
        setToken(data.token);
        console.log(`Welcome ${data.admin?.name}`);
      })
      .catch((error) => {
        if (error.response && error.response.status !== 400 && error.response.status !== 401) {
          console.error("Unexpected error status:", error.response.status, error.response.data);
          alert("An unexpected error occurred. Please try again later.");
        } else {
          alert("Username or password is incorrect.");
        }
      });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Page
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoFocus
          />
          <TextField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;