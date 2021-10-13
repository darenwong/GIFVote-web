import { Button, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import { useSQL } from "../../contexts/SQLContext.js";
import FlexListAPI from "./FlexListAPI.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    overflow: "hidden",
  },
  infiniteList: {
    height: "100%",
    marginTop: theme.spacing(8),
    display: "flex",
    justifyContent: "center",
  },
}));

function PollPage({ personal, sortBy, isFollowing }) {
  const classes = useStyles();
  const {
    data,
    getUserData,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    hasMore,
    userId,
    setSortBy,
  } = useSQL();

  return (
    <div className={classes.root}>
      <div className={classes.infiniteList}>
        <FlexListAPI
          personal={personal}
          userProfileId={null}
          isFollowing={isFollowing}
        />
      </div>
    </div>
  );
}

export default PollPage;
