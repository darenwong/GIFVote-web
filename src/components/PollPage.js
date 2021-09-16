import {Button, Grid, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useRef } from 'react';
import Poll from './Poll.js';
import PollForm from './PollForm.js';
import InfiniteScroll from "react-infinite-scroll-component";
import FadeInSection from './FadeInSection';
import { useSQL } from '../contexts/SQLContext.js';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  gridContainer:{
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2)

  },
  itemContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2)
  },
  newPollDialog: {
    position: "fixed",
    bottom: "5vmin",
    right: "5vmin",
  }
}));


function PollPage({personal, sortBy}) {
  const classes = useStyles();
  const [pollPointer, setPollPointer] = useState(0);
  const {data, getUserData, getDataset, updateDataset, refreshDataset, handleFetchMoreData, isPersonal, setIsPersonal, hasMore, userId, setSortBy} = useSQL();

  useEffect(()=>{
    setIsPersonal(personal);
    setSortBy(sortBy);
  }, [personal, sortBy])

  useEffect(()=>{
    refreshDataset();
  }, [userId])



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
            {data.map(({poll_text, gifURL, created_by, user_avatar, created_at, winner, chartData, voteData, poll_id, isVoted_bool, isVoted_option_id, totalVoteCount, comment_count, num_likes, user_liked}, index)=>{
              return (
                <Grid key={index} item xs={12} sm={6} lg={4} className={classes.itemContainer}>
                  <Poll gifURL={gifURL} key={index} user_id={userId} title={poll_text} created_by={created_by} user_avatar={user_avatar} created_at={created_at} winner={winner} chartData={chartData} data={voteData} poll_id={poll_id} isVoted_bool={isVoted_bool} totalVoteCount={totalVoteCount} comment_count={comment_count} num_likes={num_likes} user_liked={user_liked}/>
                </Grid> 
                )         
            })}
            </Grid>
        </InfiniteScroll>
      <div className={classes.newPollDialog}>
      <PollForm/>
      </div>
    </div>
  );
}

export default PollPage;