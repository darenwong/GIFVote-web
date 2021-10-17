import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useAuth0 } from "@auth0/auth0-react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import SettingsIcon from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/Info";
import FeedbackIcon from "@material-ui/icons/Feedback";
import { useSQL } from "../../contexts/SQLContext";

import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(0),
  },
  loginButton: {
    marginLeft: theme.spacing(2),
  },
}));


export default function MenuDrawer() {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const { userId } = useSQL();

  const history = useHistory();

  const handleLogOut = () =>{
    localStorage.removeItem('userId')
    logout();
  }

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
              {isAuthenticated && (
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  onClick={() => {
                    history.push(`/profile/${userId}`);
                    setIsOpen(false);
                  }}
                />
              )}
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
              <IconButton className={classes.loginButton} onClick={handleLogOut}>
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
          {false && (
            <>
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
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};
