import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Stack, FormControl, InputLabel, InputAdornment, OutlinedInput, IconButton, Card, Typography, Box } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { login } from "services/authService";
import { useAuth } from "context/authContext";

export default function Login() {
    const [userCredentials, setUserCredentials] = useState<UserCredentials>({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { userTokenAndRole, setUserTokenAndRole } = useAuth();

    const navigate = useNavigate();

    if (userTokenAndRole.token) {
        navigate('/');
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        login(userCredentials)
            .then((result) => {
                console.log('Login successful:', result);
                setUserTokenAndRole(result);
                navigate('/');
            }).catch((error) => {
                console.error('Login failed:', error);
            }).finally(() => {
                setLoading(false);
            });
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    padding: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    borderRadius: 2
                }}
            >
                <Stack spacing={3}>
                    {/* Title Section */}
                    <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                marginBottom: 1,
                                color: '#333'
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#666' }}
                        >
                            Sign in to your account
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Stack
                        component="form"
                        autoComplete="off"
                        spacing={2.5}
                        onSubmit={handleSubmit}
                    >
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <OutlinedInput
                                id="username"
                                label="Username"
                                value={userCredentials.username}
                                onChange={(e) => setUserCredentials({ ...userCredentials, username: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                }}
                            />
                        </FormControl>

                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={userCredentials.password}
                                onChange={(e) => setUserCredentials({ ...userCredentials, password: e.target.value })}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                }}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                marginTop: 2,
                                padding: '12px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                },
                                '&:disabled': {
                                    opacity: 0.6,
                                }
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}