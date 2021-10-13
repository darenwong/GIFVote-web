import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Card,
  Divider,
  ListItemText,
  ListItemAvatar,
  Tooltip,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import AccountCircle from "@material-ui/icons/AccountCircle";
import GIFComponent from "./GIFComponent";
import OptionDropdown from "./OptionDropdown.jsx";
import VoteComponent from "./vote/VoteComponent.jsx";
import StatusComponent from "./status/StatusComponent.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50vw",
    minWidth: "300px",
    maxWidth: "600px",
    marginBottom: "auto",
    marginTop: "auto",
  },
  avatar: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  titleBox: {
    display: "flex",
    alignItems: "flex-start",
  },
  titleText: {
    textAlign: "start",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "& .MuiListItemText-primary": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "& .MuiListItemText-secondary": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
}));


const Poll = React.memo(
  ({
    gifURL,
    gifimage,
    gifHeight,
    gifWidth,
    title,
    created_by,
    user_avatar,
    created_at,
    user_id,
    data,
    poll_id,
    isVoted_bool,
    chartData,
    totalVoteCount,
    comment_count,
    num_likes,
    user_liked,
  }) => {
    const classes = useStyles();

    const getDate = (date) => {
      const a = new Date(date);
      const b = new Date();
    
      const utc1 = Date.UTC(
        a.getFullYear(),
        a.getMonth(),
        a.getDate(),
        a.getHours(),
        a.getMinutes(),
        a.getSeconds()
      );
      const utc2 = Date.UTC(
        b.getFullYear(),
        b.getMonth(),
        b.getDate(),
        b.getHours(),
        b.getMinutes(),
        b.getSeconds()
      );
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    
      let sec_diff = Math.floor((utc2 - utc1) / 1000);
      let day_diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    
      if (sec_diff < 60) {
        return Math.round(sec_diff) + "s";
      } else if (sec_diff < 3600) {
        return Math.round(sec_diff / 60) + "m";
      } else if (sec_diff < 86400) {
        return Math.round(sec_diff / 3600) + "h";
      } else if (day_diff < 7) {
        return Math.round(day_diff) + "d";
      } else if (day_diff < 365) {
        return Math.round(day_diff / 7) + "w";
      } else {
        return Math.round(day_diff / 365) + "y";
      }
    };


    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Box className={classes.titleBox}>
            <NavLink
              to={`/profile/${user_id}`}
            >
              <ListItemAvatar>
                <Avatar
                  alt={"Guest"}
                  className={classes.avatar}
                  src={user_avatar}
                >
                  <AccountCircle />
                </Avatar>
              </ListItemAvatar>
            </NavLink>
            <Tooltip title={title}>
              <ListItemText
                className={classes.titleText}
                primary={title}
                secondary={created_by + " " + getDate(created_at) + " ago"}
              />
            </Tooltip>
            <OptionDropdown user_id={user_id} poll_id={poll_id} />
          </Box>
        </CardContent>
        <GIFComponent
          gifURL={gifURL}
          gifimage={gifimage}
          gifHeight={gifHeight}
          gifWidth={gifWidth}
        />
        <VoteComponent
          user_id={user_id}
          poll_id={poll_id}
          data={data}
          isVoted_bool={isVoted_bool}
          chartData={chartData}
        />
        <Divider />
        <StatusComponent
          poll_id={poll_id}
          user_id={user_id}
          totalVoteCount={totalVoteCount}
          user_liked={user_liked}
          num_likes={num_likes}
          comment_count={comment_count}
          getDate={getDate}
        />
      </Card>
    );
  },
  (prev, cur) => {
    return (
      prev.gifURL == cur.gifURL &&
      prev.gifimage == cur.gifimage &&
      prev.gifHeight == cur.gifHeight &&
      prev.gifWidth == cur.gifWidth &&
      prev.title == cur.title &&
      prev.created_by == cur.created_by &&
      prev.user_avatar == cur.user_avatar &&
      prev.created_at == cur.created_at &&
      prev.user_id == cur.user_id &&
      JSON.toString(prev.data) == JSON.toString(cur.data) &&
      prev.poll_id == cur.poll_id &&
      prev.isVoted_bool == cur.isVoted_bool &&
      JSON.toString(prev.chartData) == JSON.toString(cur.chartData) &&
      prev.totalVoteCount == cur.totalVoteCount &&
      prev.comment_count == cur.comment_count &&
      prev.num_likes == cur.num_likes &&
      prev.user_liked == cur.user_liked
    );
  }
);
export default Poll;





