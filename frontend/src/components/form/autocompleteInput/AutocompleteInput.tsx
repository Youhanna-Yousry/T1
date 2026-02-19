import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import "./AutocompleteInput.less";

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
            className="f1-autocomplete-container"
            slotProps={{
                paper: { className: 'f1-autocomplete-popover MuiPaper-root' },
                listbox: { className: 'f1-autocomplete-listbox' }
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
                        htmlInput: {
                            ...params.inputProps,
                        }
                    }}
                />
            )}
        />
    );
}