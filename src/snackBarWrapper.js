import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Button from "@mui/material/Button";

function SnackbarWrapper() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isMobile] = useState(window.innerWidth <= 768);

    const handleEmailPress = () => {
        const email = "emil.yassinov@gmail.com";
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => {
                setSnackbarOpen(true);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        } else { // If this can't copy, use this method instead, caught while testing on phone
            const emailIn = document.getElementById("emailIn"); // This is so janky, but I can't find a better way to do it
            emailIn.hidden = false;                                                 // Works but setting to visible and copy and then back to hidden
            emailIn.focus();
            emailIn.select();
            try {
                document.execCommand('copy');
                emailIn.hidden = true;
                setSnackbarOpen(true);
            } catch (err) {
                console.error('Could not copy again', err);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <React.Fragment>
            <input type="text" value="emil.yassinov@gmail.com" id="emailIn" hidden={true}/>
            <Button
                variant="outlined"
                onClick={handleEmailPress}
                color="inherit"
            >
                {isMobile ? `Email` : `Email: emil.yassinov@gmail.com`}
            </Button>
            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                autoHideDuration={1000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                style={{
                    position: 'absolute',
                    top: '110%',
                }}
            >
                <Alert icon={false}>Copied!</Alert>
            </Snackbar>
        </React.Fragment>
    );
}

export default SnackbarWrapper;