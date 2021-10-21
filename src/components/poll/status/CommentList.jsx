import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: "50vh",
    overflowY: "scroll",
    overflowX: "hidden",
    backgroundColor: "#f5f5f5",
  },
}));


export default function CommentList ({ comments, getDate }) {
  const classes = useStyles();
  const httpError = useSelector(state=>state.error)
  return (
    <List className={classes.list} dense>
      {httpError['getComments'].open && 
        <ListItem >
          <ListItemText
            primary={"Something Went Wrong"}
          />
        </ListItem>
      }
      {!httpError['getComments'].open && comments.map(
        (
          { user_name, user_id, created_at, user_avatar, comment_text },
          index
        ) => (
          <ListItem key={index}>
            <NavLink
              to={`/profile/${user_id}`}
            >
              <ListItemAvatar>
                <Avatar src={user_avatar} />
              </ListItemAvatar>
            </NavLink>
            <ListItemText
              secondary={user_name + " " + getDate(created_at) + " ago"}
              primary={comment_text}
            />
          </ListItem>
        )
      )}
    </List>
  );
};