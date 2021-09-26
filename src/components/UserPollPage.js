import { Button, Grid, Paper } from "@material-ui/core";
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
const useStyles = makeStyles((theme) => ({
  root: {},
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
    marginTop: theme.spacing(8),
    display: "flex",
    justifyContent: "center",
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function UserPollPage({ personal, sortBy }) {
  const classes = useStyles();
  const [pollPointer, setPollPointer] = useState(0);
  const {
    data,
    getUserData,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    isPersonal,
    setIsPersonal,
    hasMore,
    userId,
    setSortBy,
  } = useSQL();
  let query = useQuery();

  useEffect(() => {
    setIsPersonal({ state: personal, createdBy: query.get("user") });
    setSortBy(sortBy);
    console.log("profile is", query.get("user"));
  }, [personal, sortBy]);
  /*
  useEffect(() => {
    refreshDataset();
  }, [userId]);
*/
  return (
    <div className={classes.root}>
      <div className={classes.infiniteList}>
        <FlexListAPI personal={personal} />
      </div>
      <div className={classes.newPollDialog}>
        <PollForm />
      </div>
    </div>
  );
}

export default UserPollPage;
