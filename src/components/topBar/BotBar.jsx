import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { useAuth0 } from "@auth0/auth0-react";
import HomeIcon from "@material-ui/icons/Home";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ExploreIcon from "@material-ui/icons/Explore";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import PollForm from "../PollForm.js";
import SignInPage from "../SignInPage.js";

import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {},
  appbar: {
    top: "auto",
    bottom: "0",
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-evenly",
  },
}));

export default function BotBar() {
  const classes = useStyles();
  const { isAuthenticated } = useAuth0();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const history = useHistory();
  const handleNavToHome = () => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }
    history.push("/home");
  };
  return (
    <div className={classes.root}>
      <SignInPage
        signInMsg={"Sign in to view homepage"}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <AppBar position="fixed" color="inherit" className={classes.appbar}>
        <Toolbar className={classes.toolBar} variant="dense">
          <IconButton
            size="large"
            aria-label="home"
            color="inherit"
            className={classes.topButton}
            onClick={handleNavToHome}
          >
            {location.pathname == "/home" && (
              <HomeIcon className={classes.topButtonIcon} />
            )}
            {location.pathname != "/home" && (
              <HomeOutlinedIcon className={classes.topButtonIcon} />
            )}
          </IconButton>
          <PollForm />
          <IconButton
            size="large"
            aria-label="explore"
            color="inherit"
            className={classes.topButton}
            onClick={() => history.push("/")}
          >
            {location.pathname == "/" && (
              <ExploreIcon className={classes.topButtonIcon} />
            )}
            {location.pathname != "/" && (
              <ExploreOutlinedIcon className={classes.topButtonIcon} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
