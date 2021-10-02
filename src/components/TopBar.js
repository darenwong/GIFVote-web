import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
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
import { useSQL } from "../contexts/SQLContext";

import { NavLink, useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  title: {
    flexGrow: 1,
    color: "black",
  },
  toolbar: {
    backgroundColor: "#fafafa",
  },
  passiveLink: {
    display: "flex",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.54)",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  activeLink: {
    display: "flex",
    color: "rgba(34, 191, 160, 1)",
    textDecoration: "underline",
  },
  loginButton: {
    marginLeft: theme.spacing(2),
  },
  breadcrumbs: {
    marginLeft: "auto",
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
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const { userId } = useSQL();
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const history = useHistory();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogIn = () => {
    loginWithRedirect();
    handleClose();
  };
  const handleLogOut = () => {
    logout();
    handleClose();
  };

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
          <IconButton onClick={() => history.push("/")}>
            <img className={classes.logo} alt="GIF Vote" src={GIFVoteLogo} />
          </IconButton>
          {false && <SimpleBreadcrumbs />}
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
            {isAuthenticated && (
              <IconButton
                size="large"
                aria-label="explore"
                color="inherit"
                className={classes.topButton}
                onClick={() => history.push(`/profile/${userId}`)}
              >
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  className={classes.topButtonIcon}
                />
              </IconButton>
            )}
            {!isAuthenticated && (
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

const SimpleBreadcrumbs = () => {
  const classes = useStyles();
  const { isAuthenticated } = useAuth0();

  return (
    <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
      <NavLink
        className={classes.passiveLink}
        activeClassName={classes.activeLink}
        exact
        to="/"
      >
        <WhatshotIcon className={classes.icon} />
        Most Votes
      </NavLink>
      <NavLink
        className={classes.passiveLink}
        activeClassName={classes.activeLink}
        to="/most-like"
      >
        <FavoriteBorderIcon className={classes.icon} />
        Most Likes
      </NavLink>
      <NavLink
        className={classes.passiveLink}
        activeClassName={classes.activeLink}
        to="/latest"
      >
        <ScheduleIcon className={classes.icon} />
        Latest
      </NavLink>
      {isAuthenticated && (
        <NavLink
          className={classes.passiveLink}
          activeClassName={classes.activeLink}
          to="/your"
        >
          <FaceIcon className={classes.icon} />
          Your Polls
        </NavLink>
      )}
    </Breadcrumbs>
  );
};

const MenuDrawer = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        aria-label="menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <List>
          <ListItem>
            <ListItemAvatar>
              {isAuthenticated && <Avatar src={user.picture} alt={user.name} />}
              {!isAuthenticated && (
                <Avatar alt={"Guest"}>
                  <AccountCircle />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={user ? user.name : "Guest"}
              secondary={user ? user.email : "Sign in to see your profile"}
            />

            {isAuthenticated && (
              <IconButton className={classes.loginButton} onClick={logout}>
                <BiLogOut />
              </IconButton>
            )}
            {!isAuthenticated && (
              <IconButton
                className={classes.loginButton}
                onClick={loginWithRedirect}
              >
                <BiLogIn />
              </IconButton>
            )}
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <FeedbackIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Give Feedback"}
              secondary={"Help us improve GIF Votes"}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={"About"} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
