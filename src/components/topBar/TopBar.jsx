import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import HomeIcon from "@material-ui/icons/Home";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ExploreIcon from "@material-ui/icons/Explore";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import GIFVoteLogo from "../../images/gif_vote_logo4.png";
import PollForm from "../PollForm.js";
import SignInPage from "../SignInPage.js";
import MenuDrawer from "./MenuDrawer.jsx";

import { useSQL } from "../../contexts/SQLContext";
import { useAuth0 } from "@auth0/auth0-react";

import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    backgroundColor: "#fafafa",
  },
  logo: {
    height: "32px",
    width: "auto",
    maxWidth: "50vw",
    padding: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  topButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  topMainButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    top: "auto",
    bottom: "0",
    [theme.breakpoints.up("xs")]: {},
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  topButton: {
    padding: theme.spacing(1),
  },
  topButtonIcon: {
    height: "24px",
    width: "24px",
  },
  loginTopButton: {
    textTransform: "none",
    margin: theme.spacing(1),
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { userId } = useSQL();
  const [open, setOpen] = useState(false);

  const location = useLocation();

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
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <MenuDrawer />
          <img
            className={classes.logo}
            alt="GIF Vote"
            src={GIFVoteLogo}
            onClick={() => history.push("/")}
          />
          <div className={classes.topButtonContainer}>
            <div className={classes.topMainButtonContainer}>
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
              <PollForm />
            </div>
            {isAuthenticated || localStorage.getItem("userId") ? (
              <IconButton
                size="large"
                aria-label="explore"
                color="inherit"
                className={classes.topButton}
                onClick={() => history.push(`/profile/${userId}`)}
              >
                <Avatar
                  src={user && user.picture}
                  alt={user && user.name}
                  className={classes.topButtonIcon}
                />
              </IconButton>
            ): (
              <Button
                className={classes.loginTopButton}
                variant="contained"
                color="primary"
                size="small"
                onClick={loginWithRedirect}
              >
                Log In
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

