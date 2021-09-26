import {
  Button,
  Card,
  Grid,
  Paper,
  Avatar,
  CardHeader,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import Poll from "./Poll.js";
import PollForm from "./PollForm.js";
import FadeInSection from "./FadeInSection";
import { useSQL } from "../contexts/SQLContext.js";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import FlexListAPI from "../FlexListAPI.js";
import { useLocation } from "react-router-dom";
import ProfilePage from "./ProfilePage.js";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  gridContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  itemContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  newPollDialog: {
    position: "fixed",
    bottom: "5vmin",
    right: "5vmin",
  },
  infiniteList: {
    height: "100%",
    marginTop: theme.spacing(8),
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function UserPollPage({ personal, sortBy }) {
  const classes = useStyles();
  const [pollPointer, setPollPointer] = useState(0);
  let query = useQuery();
  /*
  useEffect(() => {
    setIsPersonal({ state: personal, createdBy: query.get("user") });
    setSortBy(sortBy);
    console.log("profile is", query.get("user"));
  }, [personal, sortBy]);*/
  /*
  useEffect(() => {
    refreshDataset();
  }, [userId]);
*/
  return (
    <div className={classes.root}>
      <div className={classes.infiniteList}>
        <ProfilePage userProfileId={query.get("user")} />
        <FlexListAPI personal={personal} userProfileId={query.get("user")} />
      </div>
      <div className={classes.newPollDialog}>
        <PollForm />
      </div>
    </div>
  );
}

export default UserPollPage;
