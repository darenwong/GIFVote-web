import React, { useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import BarChart from "./BarChart.jsx";
import VoteButton from "./VoteButton.jsx";

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    display: "flex",
    flexDirection: "flex-start",
  },
  buttonGroupContainer: {
    margin: theme.spacing(1),
    height: "100px",
    overflowY: "hidden",
    overflowX: "scroll",
    display: "flex",
    alignItems: "center",
  },
  barChart: {
    [theme.breakpoints.down("md")]: {
      height: "100px",
    },
    [theme.breakpoints.up("md")]: {
      height: "100px",
    },
    width: "90%",
    overflowY: "scroll",
    overflowX: "hidden",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: "0px",
    paddingBottom: "0px !important",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));



export default function VoteComponent ({ data, isVoted_bool, chartData, user_id, poll_id }) {
  const classes = useStyles();

  return (
    <div>
      {isVoted_bool == 1 && (
        <CardContent className={classes.barChart}>
          <BarChart data={chartData} />
        </CardContent>
      )}
      {isVoted_bool == 0 && (
        <Box className={classes.buttonGroupContainer}>
          <Box className={classes.buttonGroup}>
            {data.map((item) => (
              <VoteButton
                key={item.option_id}
                text={item.text}
                option_id={item.option_id}
                user_id={user_id}
                poll_id={poll_id}
              />
            ))}
          </Box>
        </Box>
      )}
    </div>
  );
};

