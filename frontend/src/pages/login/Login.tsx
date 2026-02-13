import { useState, useEffect } from "react";
import { Stack, Card, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { login } from "services/authService";
import { useAuth } from "context/authContext";

import { TextInput } from "components/form/textInput/TextInput";
import { PasswordInput } from "components/form/PasswordInput";
import { SubmitButton } from "components/form/submitButton/SubmitButton";

import "./Login.less";

export default function Login() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.token) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleUsernameChange = (username: string) => {
        setCredentials((prev) => ({ ...prev, username }));
        if (error) setError(null);
    };

    const handlePasswordChange = (password: string) => {
        setCredentials((prev) => ({ ...prev, password }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await login(credentials);
            setUser(result);
            navigate("/");
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setError("Incorrect username or password.");
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const isSubmitDisabled = !credentials.username || !credentials.password;

    return (
        <Box className="login-page">
            <Card className="login-card">
                <Stack spacing={3}>
                    <Box className="login-title">
                        <Typography variant="h4">Welcome Back</Typography>
                        <Typography variant="body2">Sign in to your account</Typography>
                    </Box>

                    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                        <TextInput
                            id="username"
                            label="Username"
                            value={credentials.username}
                            onChange={(username) => handleUsernameChange(username)}
                            error={!!error}
                        />

                        <PasswordInput
                            value={credentials.password}
                            onChange={(password) => handlePasswordChange(password)}
                            error={!!error}
                        />

                        {error && (
                            <Alert variant="filled" severity="error">
                                {error}
                            </Alert>
                        )}

                        <SubmitButton loading={loading} disabled={isSubmitDisabled} text="Sign In" />
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}
