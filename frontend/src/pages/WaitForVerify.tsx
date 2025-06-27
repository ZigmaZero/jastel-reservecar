import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Container, Typography, Box } from "@mui/material";

const WaitForVerify = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.verified) {
            navigate("/menu");
        }
    }, [user, navigate]);

    return (
        <>
            <Navbar showButtons={false} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        Wait for Verification
                    </Typography>
                    <Typography variant="body1">
                        Your registration request is being processed. Please wait for verification.
                    </Typography>
                </Box>
            </Container>
        </>
    )
}
export default WaitForVerify;