import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import "./SharedFormInputs.less";

interface AutocompleteInputProps {
    id: string;
    label: string;
    value: string | null;
    inputValue: string;
    options: string[];
    loading?: boolean;
    disabled?: boolean;
    onChange: (value: string | null) => void;
    onInputChange: (value: string) => void;
}

export function AutocompleteInput({
    id, label, value, inputValue, options, loading = false, disabled = false, onChange, onInputChange
}: AutocompleteInputProps) {
    return (
        <Autocomplete
            id={id}
            freeSolo
            options={options}
            value={value}
            onChange={(event, newValue) => onChange(newValue)}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => onInputChange(newInputValue)}
            loading={loading}
            disabled={disabled}
            className="f1-form-control"
            slotProps={{
                paper: { className: 'f1-dropdown-popover MuiPaper-root' },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="filled"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        },
                        htmlInput: { ...params.inputProps }
                    }}
                />
            )}
        />
    );
}