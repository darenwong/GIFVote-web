import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Breadcrumbs } from "@material-ui/core";
import DropdownMenu from "./DropdownMenu.js";
import { useAuth0 } from "@auth0/auth0-react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import SettingsIcon from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/Info";
import FeedbackIcon from "@material-ui/icons/Feedback";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ScheduleIcon from "@material-ui/icons/Schedule";
import FaceIcon from "@material-ui/icons/Face";
import HomeIcon from "@material-ui/icons/Home";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ExploreIcon from "@material-ui/icons/Explore";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import GIFVoteLogo from "../images/gif_vote_logo3.png";
import PollForm from "./PollForm.js";
import SignInPage from "./SignInPage.js";

import { NavLink, useHistory, useLocation } from "react-router-dom";
import AddBoxOutlined from "@material-ui/icons/AddBoxOutlined";

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

export default function BotAppBar() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
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
