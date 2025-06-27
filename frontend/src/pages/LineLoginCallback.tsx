import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import checkState from "../api/line/checkState";
import authToProfile from "../api/line/exchangeAccessToken";
import userRegister from "../api/user/userRegister";
import { useUser } from "../contexts/UserContext";
import userLogin from "../api/user/userLogin";
import Navbar from "../components/Navbar";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    CircularProgress,
    Paper
} from "@mui/material";

const LineLoginCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { user, setUser, setToken } = useUser();
    const action = searchParams.get('action');
    const authorizationCode = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');
    const navigate = useNavigate();

    const [registered, setRegistered] = useState(true);
    const [lineId, setLineId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!state) {
            navigate("/line/access");
            return;
        }
        checkState(state).then((success) => {
            if (!success) {
                alert("LINE Login processing failed. Please try again.");
                navigate("/line/access");
                return;
            }
        });
        if (error) {
            alert(`
                LINE Login authorization failed: ${error}
                ${error_description}
            `);
            navigate("/line/access");
            return;
        }
        if (!authorizationCode) {
            alert(`Did not obtain authorization code from LINE Login.`);
            navigate("/line/access");
            return;
        }

        const thisUrl =
            action === "checkin" || action === "checkout"
                ? `https://splendid-sheep-wrongly.ngrok-free.app/line/callback?action=${action}`
                : `https://splendid-sheep-wrongly.ngrok-free.app/line/callback`;

        authToProfile(authorizationCode, thisUrl)
            .then((profile) => {
                if (profile) {
                    setLineId(profile.userId);
                    return userLogin(profile.userId);
                } else {
                    throw new Error("Failed to get LINE profile.");
                }
            })
            .then(({ user, token }) => {
                setUser(user);
                setToken(token);
                if (user.verified) {
                    if (action === "checkin") {
                        navigate("/checkin");
                    } else if (action === "checkout") {
                        navigate("/checkout");
                    } else navigate("/menu");
                } else {
                    navigate("/verify");
                }
            })
            .catch(() => {
                setRegistered(false);
            });
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        try {
            await userRegister(username, lineId);
            const { user, token } = await userLogin(lineId);
            setUser(user);
            setToken(token);
            navigate("/verify");
        } catch (error) {
            alert("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar showButtons={user !== null} />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                {registered ? (
                    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>
                            Redirecting...
                        </Typography>
                        <CircularProgress sx={{ mt: 2 }} />
                    </Paper>
                ) : (
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Register Page
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            You are not registered with the system.
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Please enter your full name to register.
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <TextField
                                label="Full Name"
                                id="username"
                                name="username"
                                fullWidth
                                required
                                margin="normal"
                                disabled={isSubmitting}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || !lineId}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : "Register"}
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default LineLoginCallback;