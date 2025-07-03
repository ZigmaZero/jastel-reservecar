import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import Navbar from "../components/Navbar";

const CheckinSuccess = () => {
    const { user, token } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user || !token) {
            navigate("/line/access");
            return;
        } else if (!user.verified) {
            navigate("/verify");
            return;
        }
    }, []);
    return (
        <>
            <Navbar showButtons={user !== null} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        Checkin
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        การ Checkin เสร็จสมบูรณ์แล้ว
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        กรุณาทำการ Checkout เมื่อเสร็จสิ้นการใช้งานรถ
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={() => navigate("/checkout")}
                    >
                        Checkout
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default CheckinSuccess;