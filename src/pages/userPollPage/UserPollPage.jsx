import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import { useSQL } from "../../contexts/SQLContext.js";
import FlexListAPIPersonal from "./FlexListAPIPersonal.jsx";
import { useLocation } from "react-router-dom";

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
  let query = useQuery();
  const { refreshDataset } = useSQL();

  useEffect(() => {
    refreshDataset();
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
