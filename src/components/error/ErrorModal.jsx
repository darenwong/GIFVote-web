import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Paper,
  Snackbar,
  Slide,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  DialogContent,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useSQL } from "../../contexts/SQLContext";
import ohnoGIF from "../../images/ohno.mp4";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    display: "flex",
    flexDirection: "row",
  },
  titleText: {
    alignSelf: "center",
    marginRight: theme.spacing(2),
  },
  closeButton: {
    marginLeft: "auto",
    color: theme.palette.grey[500],
  },
  video: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

function ErrorModal({error}) {
  const classes = useStyles();
  const { httpError, clearHttpError } = useSQL();
  const handleDismissHttpError = () =>{
    clearHttpError(error);
  }

  return (
    <div>
      <video
        width="60%"
        height="auto"
        style={{display:"none"}}
        preload="auto"
      >
        <source src={ohnoGIF}/>
      </video>
      <Dialog open={httpError[error].open} onClose={handleDismissHttpError} className={classes.root}>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h4" className={classes.titleText}>
            Something Went Wrong
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleDismissHttpError}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.videoContainer}>
          <Typography gutterBottom>{httpError[error].message}</Typography>
          <video
            width="60%"
            height="auto"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={classes.video}
          >
            <source src={ohnoGIF}/>
          </video>
        </DialogContent>
        <Button variant="contained" style={{textTransform: "none"}} color="primary" onClick={handleDismissHttpError}>
          Refresh Page
        </Button>
      </Dialog>
    </div>
  );
}

export default ErrorModal;