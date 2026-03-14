import { Box, FilledInput, FormControl, InputLabel } from "@mui/material";
import "./SharedFormInputs.less";

interface TextInputProps {
    id: string;
    label: string;
    value: string;
    error: boolean;
    onChange: (value: string) => void;
}

export function TextInput({ id, label, value, error, onChange }: TextInputProps) {
    return (
        <Box className="f1-form-control">
            <FormControl variant="filled" fullWidth error={error}>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <FilledInput
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </FormControl>
        </Box>
    );
}
