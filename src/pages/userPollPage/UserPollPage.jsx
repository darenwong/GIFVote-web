import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import FlexListAPIPersonal from "./FlexListAPIPersonal.jsx";
import { useLocation } from "react-router-dom";
import { pollActions } from "../../store/pollSlice.js";
import { useDispatch } from "react-redux";

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
    flexDirection: "column",
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function UserPollPage({ personal, sortBy, isFollowing, userid }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  let query = useQuery();

  useEffect(() => {
    dispatch(pollActions.refreshDataset());
  }, [query.get("user")]);

  return (
    <div className={classes.root}>
      <div className={classes.infiniteList}>
        <FlexListAPIPersonal
          personal={personal}
          userProfileId={userid}
          isFollowing={isFollowing}
        />
      </div>
    </div>
  );
}

export default UserPollPage;
