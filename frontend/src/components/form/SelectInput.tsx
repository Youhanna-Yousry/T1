import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import "./SharedFormInputs.less";

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
    lightTheme?: boolean;
}

export function SelectInput({
    id, label, value, options, onChange, disabled, emptyLabel, lightTheme = false
}: SelectInputProps) {
    const handleChange = (e: SelectChangeEvent<string | number>) => {
        onChange(e.target.value);
    };

    const containerClass = `f1-form-control ${lightTheme ? 'f1-light' : ''}`;
    const popoverClass = `f1-dropdown-popover MuiPaper-root ${lightTheme ? 'f1-light-popover' : ''}`;

    return (
        <FormControl fullWidth variant="filled" className={containerClass}>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                labelId={`${id}-label`}
                id={id}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className="MuiSelect-root"
                MenuProps={{ PaperProps: { className: popoverClass } }}
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