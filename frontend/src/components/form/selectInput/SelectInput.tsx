import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import "./SelectInput.less";

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectInputProps {
    id: string;
    label: string;
    value: string | number;
    options: SelectOption[];
    onChange: (value: string | number) => void;
    disabled?: boolean;
    emptyLabel?: string;
}

export function SelectInput({ id, label, value, options, onChange, disabled, emptyLabel }: SelectInputProps) {
    const handleChange = (e: SelectChangeEvent<string | number>) => {
        onChange(e.target.value);
    };

    return (
        <FormControl fullWidth variant="filled" className="f1-select-container">
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                labelId={`${id}-label`}
                id={id}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                MenuProps={{ PaperProps: { className: 'f1-menu-popover' } }}
            >
                {emptyLabel && (
                    <MenuItem value=""><em>{emptyLabel}</em></MenuItem>
                )}
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}