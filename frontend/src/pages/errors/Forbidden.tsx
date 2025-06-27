import { useEffect } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";

const Forbidden = () => {
    const { admin } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        if(admin) {
            navigate("/admin/dashboard");
        }
    })

    return (
        <>
            <Navbar showButtons={false} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        403 - Forbidden
                    </Typography>
                </Box>
            </Container>
        </>
    )
}
export default Forbidden;