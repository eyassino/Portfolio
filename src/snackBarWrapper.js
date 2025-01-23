import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Button from "@mui/material/Button";

function SnackbarWrapper() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleEmailPress = () => {
        navigator.clipboard.writeText("emil.yassinov@gmail.com");
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleEmailPress} color="inherit">Email: emil.yassinov@gmail.com</Button>
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