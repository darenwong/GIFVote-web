import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@material-ui/core";
import { useSQL } from "../../contexts/SQLContext.js";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from "@material-ui/icons/Share";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import Delete from "@material-ui/icons/Delete";


const useStyles = makeStyles((theme) => ({
  root: {
  },
  moreButton: {
    marginLeft: "auto",
    padding: theme.spacing(0.5),
  },
}));

export default function OptionDropdown ({ user_id, poll_id }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { userId, submitDeletePoll, refreshDataset } = useSQL();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePoll = ({ poll_id }) => {
    submitDeletePoll({ poll_id })
      .then((res) => {
        refreshDataset();
      })
      .catch(() => {});
  };

  return (
    <>
      <IconButton className={classes.moreButton} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {false && (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
        )}
        <MenuItem>
          <Button
            href="mailto:gifvote0@gmail.com"
            style={{ textTransform: "none" }}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText>Report</ListItemText>
          </Button>
        </MenuItem>
        {user_id == userId && (
          <MenuItem>
            <Button
              style={{ textTransform: "none" }}
              color="secondary"
              onClick={() => {
                handleDeletePoll({ poll_id });
              }}
            >
              <ListItemIcon>
                <Delete color="secondary" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </Button>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};