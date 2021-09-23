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

function PollPage({ personal, sortBy }) {
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

  useEffect(() => {
    setIsPersonal(personal);
    setSortBy(sortBy);
  }, [personal, sortBy]);

  useEffect(() => {
    refreshDataset();
  }, [userId]);

  return (
    <div className={classes.root}>
      <div className={classes.infiniteList}>
        <FlexListAPI />
      </div>
      <div className={classes.newPollDialog}>
        <PollForm />
      </div>
    </div>
  );
}

export default PollPage;
