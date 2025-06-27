import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Container, Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import getState from "../api/line/getState";

const LineLogin: React.FC = () => {
    const [searchParams] = useSearchParams();
    const action = searchParams.get('action');
    const [begin, setBegin] = useState(false);

    // These constants are only needed for the redirect step
    const URI = "https://access.line.me/oauth2/v2.1/authorize";
    const CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID as string;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI as string;
    const SCOPE = "profile%20openid";

    useEffect(() => {
        if (begin) {
            getState().then((state) => {
                let redirectUriWithAction = REDIRECT_URI;
                if (action === "checkin" || action === "checkout") {
                    // Append ?action=checkin or ?action=checkout
                    const separator = '?';
                    redirectUriWithAction = `${REDIRECT_URI}${separator}action=${action}`;
                }
                const loginUrl = `${URI}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUriWithAction)}&state=${state}&scope=${SCOPE}`;
                window.location.href = loginUrl;
            });
        }
    // Only run when begin is set to true
    }, [begin, action, REDIRECT_URI, CLIENT_ID, URI, SCOPE]);

    const handleLogin = () => {
        setBegin(true);
    };

    if (begin) {
        return (
            <>
                <Navbar showButtons={false} />
                <Container maxWidth="sm" sx={{ mt: 8 }}>
                    <Box textAlign="center">
                        <Typography variant="body1">
                            Redirecting to LINE Login...
                        </Typography>
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar showButtons={false} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Welcome to ReserveCar Service!
                    </Typography>
                    <Button
                        id="line-login"
                        onClick={handleLogin}
                        variant="contained"
                        sx={{
                            backgroundColor: "#00C300",
                            color: "#fff",
                            textTransform: "none",
                            fontSize: "16px",
                            padding: "10px 24px",
                            borderRadius: "4px",
                            boxShadow: 2,
                            mt: 3,
                            '&:hover': {
                                backgroundColor: "#00a300"
                            }
                        }}
                        startIcon={
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                                alt="LINE"
                                style={{
                                    width: 24,
                                    height: 24,
                                    background: "#fff",
                                    borderRadius: "50%"
                                }}
                            />
                        }
                    >
                        Login with LINE
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default LineLogin;