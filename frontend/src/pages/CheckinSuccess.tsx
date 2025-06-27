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
                        Checkin Success!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Thank you for checking in using the system.
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Please don't forget to checkout after you're done.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default CheckinSuccess;