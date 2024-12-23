import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

const Error = ({ errorMessage, onClose }: { errorMessage: string; onClose: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (errorMessage) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [errorMessage]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle id="error-dialog-title">Error</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="error" id="error-dialog-description">
          {errorMessage}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Error;
