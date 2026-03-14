import { useState } from "react";
import { FormControl, InputLabel, InputAdornment, IconButton, Box, FilledInput } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./SharedFormInputs.less";

interface PasswordInputProps {
    id?: string;
    label: string;
    value: string;
    error?: boolean;
    onChange: (value: string) => void;
}

export function PasswordInput({ id = "password", label, value, error = false, onChange }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Box className="f1-form-control">
            <FormControl variant="filled" fullWidth error={error}>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <FilledInput
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
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