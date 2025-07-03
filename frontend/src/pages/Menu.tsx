import { Container, Box, Typography, Button, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Menu = () => {
    const { user, token } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user || !user.verified || !token) {
        navigate("/line/access");
        return;
        }
    })
    
    return (
        <>
        <Navbar showButtons={user !== null} />
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Jastel ReserveCar
                </Typography>
                <Typography variant="body1">
                    ยินดีต้อนรับ คุณ {user?.name}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/checkin")}
                    >
                        Checkin
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => navigate("/checkout")}
                    >
                        Checkout
                    </Button>
                </Stack>
            </Box>
        </Container>
        </>
    )
}
export default Menu;