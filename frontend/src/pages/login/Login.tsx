import React, { useState, useEffect } from "react";
import { Stack, Card, Typography, Box, Alert, Divider, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Translate as TranslateIcon } from "@mui/icons-material";

import { login } from "services/authService";
import { useAuth } from "context/authContext";

import { TextInput } from "components/form/textInput/TextInput";
import { PasswordInput } from "components/form/PasswordInput";
import { SubmitButton } from "components/form/submitButton/SubmitButton";

import "./Login.less";

export default function Login() {
    const { t, i18n } = useTranslation();
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

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
                setError(t("login.error_auth"));
            } else {
                setError(t("login.error_sys"));
            }
        } finally {
            setLoading(false);
        }
    };

    const isSubmitDisabled = !credentials.username || !credentials.password;

    return (
        <Box className="login-page">
            <div className="bg-stripe" />

            <Box className="lang-toggle-wrapper">
                <IconButton onClick={toggleLanguage} className="lang-btn">
                    <TranslateIcon />
                    <Typography variant="button" className="lang-text">
                        {i18n.language === 'en' ? 'العربية' : 'ENGLISH'}
                    </Typography>
                </IconButton>
            </Box>

            <Card className="login-card">
                <Box className="card-header-deco">
                    <Typography variant="caption" className="system-text">
                        SYS_AUTH_V1
                    </Typography>
                    <Box className="status-light" />
                </Box>

                <Stack spacing={4}>
                    <Box className="login-title">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" className="brand-title">
                                TAKYULA <Box component="span" className="red-text">1</Box>
                            </Typography>
                            <Divider className="title-divider" />
                            <Typography variant="subtitle2" className="subtitle">
                                DRIVER AUTHENTICATION
                            </Typography>
                        </Box>
                    </Box>

                    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
                        <TextInput
                            id="username"
                            label={t("login.username")}
                            value={credentials.username}
                            onChange={(username) => handleUsernameChange(username)}
                            error={!!error}
                        />

                        <PasswordInput
                            label={t("login.password")}
                            value={credentials.password}
                            onChange={(password) => handlePasswordChange(password)}
                            error={!!error}
                        />

                        {error && (
                            <Alert variant="filled" severity="error" className="f1-alert">
                                {error}
                            </Alert>
                        )}

                        <Box mt={2}>
                            <SubmitButton
                                loading={loading}
                                disabled={isSubmitDisabled}
                                text={loading ? t("login.loading") : t("login.submit")}
                            />
                        </Box>
                    </Stack>
                </Stack>

                <Box className="card-footer-deco">
                    <Typography variant="caption">{t("login.secure_conn")}</Typography>
                    <Typography variant="caption">FIA_2026</Typography>
                </Box>
            </Card>
        </Box>
    );
}