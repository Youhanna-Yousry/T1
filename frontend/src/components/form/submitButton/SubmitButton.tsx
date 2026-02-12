import { Button } from "@mui/material";
import "./SubmitButton.less";

interface SubmitButtonProps {
    loading: boolean;
    disabled?: boolean;
    text: string;
}

export function SubmitButton({ loading, disabled, text }: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            variant="contained"
            fullWidth
            loading={loading}
            disabled={disabled || loading}
            className="submit-button"
        >
            {text}
        </Button>
    );
}
