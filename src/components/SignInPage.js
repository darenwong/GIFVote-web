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
import { useAuth0 } from "@auth0/auth0-react";

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

function SignInPage({ signInMsg, open, handleClose }) {
  const classes = useStyles();
  const { loginWithRedirect, loginWithPopup, isAuthenticated } = useAuth0();
  //const [signInOpen, setSignInOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && open) {
      handleClose();
    }
  }, [isAuthenticated]);

  const getMotivationalURL = () => {
    let choice = [
      "https://media0.giphy.com/media/xT9DPnxOqFNu0vObyU/giphy-downsized-small.mp4?cid=ecf05e477ybh0yl5kdyzkwyz5g7ljply8vk3ixadsfv9ywjz&rid=giphy-downsized-small.mp4&ct=g",
      "https://media0.giphy.com/media/l2Sq3jYHktALKdQJO/giphy-downsized-small.mp4?cid=ecf05e477ybh0yl5kdyzkwyz5g7ljply8vk3ixadsfv9ywjz&rid=giphy-downsized-small.mp4&ct=g",
      "https://media1.giphy.com/media/ur5T6Wuw4xK2afXVmd/giphy-downsized-small.mp4?cid=ecf05e477ybh0yl5kdyzkwyz5g7ljply8vk3ixadsfv9ywjz&rid=giphy-downsized-small.mp4&ct=g",
      "https://media2.giphy.com/media/26xBSxisb1xYv1dja/giphy-downsized-small.mp4?cid=ecf05e477ybh0yl5kdyzkwyz5g7ljply8vk3ixadsfv9ywjz&rid=giphy-downsized-small.mp4&ct=g",
      "https://media0.giphy.com/media/rVaFLAGrPcmlQR1nmt/giphy-downsized-small.mp4?cid=ecf05e477ybh0yl5kdyzkwyz5g7ljply8vk3ixadsfv9ywjz&rid=giphy-downsized-small.mp4&ct=g",
      "https://media1.giphy.com/media/xT9DPPqwOCoxi3ASWc/giphy-downsized-small.mp4?cid=ecf05e477ybh0yl5kdyzkwyz5g7ljply8vk3ixadsfv9ywjz&rid=giphy-downsized-small.mp4&ct=g",
      "https://media0.giphy.com/media/xT9DPGsywQ5zMfR6KY/giphy-downsized-small.mp4?cid=ecf05e477ybh0yl5kdyzkwyz5g7ljply8vk3ixadsfv9ywjz&rid=giphy-downsized-small.mp4&ct=g",
      "https://media4.giphy.com/media/26n6yBeeXFU8C5j8c/giphy-downsized-small.mp4?cid=ecf05e471vfffwv91zo73j3x8h4q83yeezw44y1j75uf3foo&rid=giphy-downsized-small.mp4&ct=g",
      "https://media4.giphy.com/media/l1BgRkTSJlYgCVqHm/giphy-downsized-small.mp4?cid=ecf05e47lhwhdp46xml09m3af3257q7u8dtvdxamfntftgnh&rid=giphy-downsized-small.mp4&ct=g",
    ];
    return choice[Math.floor(Math.random() * choice.length)];
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} className={classes.root}>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h4" className={classes.titleText}>
            {signInMsg}
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.videoContainer}>
          <Typography gutterBottom>Here's a GIF to start your day!</Typography>
          <video
            width="60%"
            height="auto"
            autoPlay
            loop
            muted
            playsInline
            className={classes.video}
          >
            <source src={getMotivationalURL()} />
          </video>
        </DialogContent>
        <Button variant="contained" color="primary" onClick={loginWithRedirect}>
          Sign In
        </Button>
      </Dialog>
    </div>
  );
}

export default SignInPage;
