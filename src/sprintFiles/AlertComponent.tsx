import { Dialog, DialogContent, Alert, Button, DialogActions } from "@mui/material";
import { useState } from "react";

/**
 * Pieces of code necessary to use this AlertComponent within a parent component:
 * PARENT: 
 * const [errorMessage, setErrorMessage] = useState("");
 * In the returned div, 
 *  {
        errorMessage !== "" &&
        <AlertComponent message = {errorMessage} setErrorMessage = {setErrorMessage} />
    }
 * When the error message is set in the parent, this alert component will now automatically render.
    
 * @param message - The message for the popup to display
 * @param setErrorMessage - The state function that is used to manage the message that's displayed
 * @returns A dismissable Alert Component
 */
const AlertComponent = ({ message, setErrorMessage } : { message: string, setErrorMessage: (value: React.SetStateAction<string>) => void}) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setErrorMessage("");
        setOpen(false);
    }
    return (
        <Dialog
            open = {open}
            onClose = {handleClose}
        >
            <DialogContent>
                <Alert severity="error">{message}</Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Dismiss</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AlertComponent;