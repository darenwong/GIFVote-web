import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Breadcrumbs } from '@material-ui/core';
import DropdownMenu from './DropdownMenu.js';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Link
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "black"
  },
  toolbar: {
    backgroundColor: "#fafafa",
  }
}));

export default function MenuAppBar({isOpen, setIsOpen}) {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const {loginWithRedirect, logout, isAuthenticated, user} = useAuth0();

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
  }
  const handleLogOut = () => {
    logout();
    handleClose();
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" className={classes.menuButton} color="textPrimary" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            MEME Votes!
          </Typography>
          <SimpleBreadcrumbs/>
          <DropdownMenu isOpen={isOpen} setIsOpen={setIsOpen}/>
          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="textPrimary"
              > 
                {isAuthenticated && 
                  <Avatar src={user.picture} alt={user.name}/>
                }
                {!isAuthenticated &&
                  <Avatar alt={"Guest"}>
                    <AccountCircle />
                  </Avatar>
                }
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {isAuthenticated && 
                  <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                }
                {!isAuthenticated &&
                  <MenuItem onClick={handleLogIn}>Log In</MenuItem>
                }
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}


const SimpleBreadcrumbs = (event) => {

  const handleClick = () => {
    console.log(event)
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link color="inherit" to="/" onClick={(event)=>handleClick(event)}>
        All Polls
      </Link>
      <Link color="inherit" to="/your" onClick={(event)=>handleClick(event)}>
        Your Polls
      </Link>
    </Breadcrumbs>
  );
}