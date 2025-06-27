import { Container, Box, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";

const NotFound = () => {
    return (
        <>
            <Navbar showButtons={false} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        404 - Not Found
                    </Typography>
                </Box>
            </Container>
        </>
    )
}
export default NotFound;