import { Button } from "@mui/material";
import "./SubmitButton.less";

interface SubmitButtonProps {
    loading: boolean;
    text: string;
}

export function SubmitButton({ loading, text }: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            variant="contained"
            fullWidth
            loading={loading}
            disabled={loading}
            className="submit-button"
        >
            {text}
        </Button>
    );
}
