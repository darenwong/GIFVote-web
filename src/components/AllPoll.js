import { Button, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import Poll from "./Poll.js";
import PollForm from "./PollForm.js";
import FadeInSection from "./FadeInSection";
import { useSQL } from "../contexts/SQLContext.js";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
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
}));

function AllPoll({ userId, isOpen, setIsOpen }) {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [addTrig, setAddTrig] = useState(false);
  const [pollPointer, setPollPointer] = useState(0);
  const [
    data,
    getUserData,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    isPersonal,
    setIsPersonal,
    hasMore,
  ] = useSQL();

  useEffect(() => {
    setIsPersonal(0);
  }, []);

  useEffect(() => {
    if (addTrig == true) {
      updateDataset(pollPointer);
      setAddTrig(false);
    }
  }, [addTrig]);

  useEffect(() => {
    refreshDataset();
  }, [userId]);

  const addCount = () => {
    console.log("cur count", count);
    setCount(count + 1);
  };

  const activateTrig = () => {
    console.log("activated");
    setAddTrig(true);
  };

  return (
    <div className={classes.root}>
      <InfiniteScroll
        dataLength={data.length}
        next={handleFetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Grid container spacing={0} className={classes.gridContainer}>
          {data.map(
            (
              {
                poll_text,
                gifURL,
                created_by,
                created_at,
                winner,
                chartData,
                voteData,
                poll_id,
                isVoted_bool,
                isVoted_option_id,
                totalVoteCount,
                comment_count,
                num_likes,
                user_liked,
              },
              index
            ) => {
              return (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  className={classes.itemContainer}
                >
                  <Poll
                    gifURL={gifURL}
                    activateTrig={activateTrig}
                    setPollPointer={setPollPointer}
                    getDataset={getDataset}
                    updateDataset={updateDataset}
                    key={index}
                    user_id={userId}
                    title={poll_text}
                    created_by={created_by}
                    created_at={created_at}
                    winner={winner}
                    chartData={chartData}
                    data={voteData}
                    poll_id={poll_id}
                    isVoted_bool={isVoted_bool}
                    totalVoteCount={totalVoteCount}
                    comment_count={comment_count}
                    num_likes={num_likes}
                    user_liked={user_liked}
                  />
                </Grid>
              );
            }
          )}
        </Grid>
      </InfiniteScroll>
      <div className={classes.newPollDialog}>
        <PollForm
          user_id={userId}
          getDataset={getDataset}
          refreshDataset={refreshDataset}
          addCount={addCount}
          activateTrig={activateTrig}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
}

export default AllPoll;
