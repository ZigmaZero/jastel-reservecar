import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Box, Container, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

const CheckoutSuccess = () => {
    const { user, token } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user || !token) 
        {
            navigate("/line/access");
            return; // Prevent rendering if user is not logged in
        }
        else if (!user.verified) {
            navigate("/verify");
            return; // Prevent rendering if user is not verified
    }}, []);
    return (
        <>
        <Navbar showButtons={user !== null} />
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Checkout
                </Typography>
                <Typography variant="body1">
                    การ Checkout เสร็จสมบูรณ์แล้ว
                </Typography>
                <Typography variant="body2" gutterBottom>
                    ขอบคุณที่ใช้ระบบจองรถ Jastel
                </Typography>
            </Box>
        </Container>
        </>
    )
}

export default CheckoutSuccess;