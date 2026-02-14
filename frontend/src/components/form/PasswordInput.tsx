import { useState } from "react";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./textInput/TextInput.less";

interface PasswordInputProps {
    value: string;
    error: boolean;
    onChange: (value: string) => void;
}

export function PasswordInput({ value, error, onChange }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box className="input-container">
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password" error={error}>Password</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={value}
                    error={error}
                    label="Password"
                    onChange={(e) => onChange(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </Box>
    );
}
