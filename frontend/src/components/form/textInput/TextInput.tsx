import { Box, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import "./TextInput.less";

interface TextInputProps {
    id: string;
    label: string;
    value: string;
    error: boolean;
    onChange: (value: string) => void;
}

export function TextInput({ id, label, value, error, onChange }: TextInputProps) {
    return (
        <Box className="input-container">
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor={id} error={error}>{label}</InputLabel>
                <OutlinedInput
                    id={id}
                    label={label}
                    value={value}
                    error={error}
                    onChange={(e) => onChange(e.target.value)}
                />
            </FormControl>
        </Box>
    );
}
