import {Button, Grid, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useRef } from 'react';
import Poll from './Poll.js';
import PollForm from './PollForm.js';
import InfiniteScroll from "react-infinite-scroll-component";
import FadeInSection from './FadeInSection';

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


function AllPoll({userId, isOpen, setIsOpen}) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const result = useRef(10);
  const [count, setCount] = useState(0);
  const [addTrig, setAddTrig] = useState(false);
  const [pollPointer, setPollPointer] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(()=>{
    if (addTrig == true){
      updateDataset(pollPointer);
      setAddTrig(false);
    }
  }, [addTrig])

  useEffect(()=>{
    console.log("change",JSON.parse(JSON.stringify(data)));
    if (data.length == 0) {getDataset()}
  },[data])

  useEffect(()=>{
    refreshDataset();
  }, [userId])

  const getDataset = () => {
    if (data.length > result.current || !hasMore) {return}

    console.log("calling API", result.current)
    fetch(`http://localhost:8080/api-vote/?user_id=${userId}&result=${result.current}`)
    .then(res => res.json())
    .then(
      (results) => {
        console.log("success",results);
        let temp = {};
        for (let i = 0; i < results.length; i++) {
          let {poll_id, poll_text, gifURL, option_id, option_name, voteCount, totalVoteCount, created_by, created_at, isVoted_bool, isVoted_option_id, comment_count, num_likes, user_liked} = results[i];
          if (!(poll_id in temp)) {temp[poll_id] = {poll_text, poll_id, gifURL, totalVoteCount, created_by, created_at, options:[],isVoted_bool,isVoted_option_id, comment_count, num_likes, user_liked,
            chartData : {
              labels: [],
              datasets: [
                {
                  barThickness: 10,
                  maxBarThickness: 10,
                  label: '# of Votes',
                  data: [],
                  backgroundColor: [],
                }
              ]},
            voteData: []
            }
          };/*
          let labels = [''];
          option_name.split(' ').map((value)=>{
            if (labels[labels.length-1].length + value.length > 20){
              labels.push('');
            }
            labels[labels.length-1] += ' '+value
            console.log(labels)
          })*/
          temp[poll_id].options.push({option_id, option_name, voteCount});
          temp[poll_id].chartData.labels.push(option_name);
          temp[poll_id].chartData.datasets[0].data.push(Number(voteCount));
          if (isVoted_option_id == option_id) {temp[poll_id].chartData.datasets[0].backgroundColor.push('rgba(63, 81, 181, 1)');}
          else {temp[poll_id].chartData.datasets[0].backgroundColor.push('rgba(10, 10, 10, 0.5)');}

          temp[poll_id].voteData.push({'option_id':option_id,'text':option_name, 'votes':Number(voteCount)});
        }
        let arr = Object.values(temp);
        arr.sort((a, b)=> b.totalVoteCount - a.totalVoteCount);
        setData([...data, ...arr]);
        if (arr.length == 0){
          setHasMore(false);
        }
    })
    .catch(console.log)
  } 

  const updateDataset = (pollId) => {

    console.log("calling Update API")
    console.log('before before', JSON.parse(JSON.stringify(data)));
    fetch(`http://localhost:8080/api-vote-update/?user_id=${userId}&poll_id=${pollId}`)
    .then(res => res.json())
    .then(
      (results) => {
        console.log("success",results);
        let temp = {};
        for (let i = 0; i < results.length; i++) {
          let {poll_id, poll_text, gifURL, option_id, option_name, voteCount, totalVoteCount, created_by, created_at, isVoted_bool, isVoted_option_id, comment_count, num_likes, user_liked} = results[i];
          if (!(poll_id in temp)) {temp[poll_id] = {poll_text, poll_id, gifURL, totalVoteCount, created_by, created_at, options:[],isVoted_bool,isVoted_option_id,comment_count, num_likes, user_liked,
            chartData : {
              labels: [],
              datasets: [
                {
                  barThickness: 10,
                  maxBarThickness: 10,
                  label: '# of Votes',
                  data: [],
                  backgroundColor: [],
                }
              ]},
            voteData: []
            }
          };
          temp[poll_id].options.push({option_id, option_name, voteCount});
          temp[poll_id].chartData.labels.push(option_name);
          temp[poll_id].chartData.datasets[0].data.push(Number(voteCount));
          if (isVoted_option_id == option_id) {temp[poll_id].chartData.datasets[0].backgroundColor.push('rgba(63, 81, 181, 1)');}
          else {temp[poll_id].chartData.datasets[0].backgroundColor.push('rgba(10, 10, 10, 0.5)');}

          temp[poll_id].voteData.push({'option_id':option_id,'text':option_name, 'votes':Number(voteCount)});
        }
        let data_copy = JSON.parse(JSON.stringify(data));
        console.log('before', JSON.parse(JSON.stringify(data)));
        for (let i = 0; i<data_copy.length; i++){
          if (data_copy[i].poll_id == pollId){
            data_copy[i] = JSON.parse(JSON.stringify(temp[pollId]));
            break
          }
        }
        console.log(data_copy);
        setData(JSON.parse(JSON.stringify(data_copy)));
    })
    .catch(console.log)
    
  }

  const refreshDataset = () => {
    result.current = 10;
    setHasMore(true);
    setData([]);
  }

  const handleFetchMoreData = () => {
    if (isOpen == false) {return}

    console.log("fetching more data ", result, data.length);
    if (data.length < result.current){
      console.log("cancel fetch more data")
      return;
    }
    result.current += 10;
    getDataset();
  }

  const addCount = () => {
    console.log("cur count", count);
    setCount(count+1);
  }

  const activateTrig = () => {
    console.log("activated")
    setAddTrig(true);
  }


  const getStyle = () => {
    if (!isOpen) {return {display: "none", zIndex: "-1000"}}
    return {}
  }

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
            {data.map(({poll_text, gifURL, created_by, created_at, winner, chartData, voteData, poll_id, isVoted_bool, isVoted_option_id, totalVoteCount, comment_count, num_likes, user_liked}, index)=>{
              return (
                <Grid key={index} item xs={12} sm={6} lg={4} className={classes.itemContainer}>
                  <Poll gifURL={gifURL} activateTrig={activateTrig} setPollPointer={setPollPointer} getDataset={getDataset} updateDataset={updateDataset} key={index} user_id={userId} title={poll_text} created_by={created_by} created_at={created_at} winner={winner} chartData={chartData} data={voteData} poll_id={poll_id} isVoted_bool={isVoted_bool} totalVoteCount={totalVoteCount} comment_count={comment_count} num_likes={num_likes} user_liked={user_liked}/>
                </Grid> 
                )         
            })}
            </Grid>
        </InfiniteScroll>
      <div className={classes.newPollDialog}>
      <PollForm user_id={userId} getDataset={getDataset} refreshDataset={refreshDataset} addCount={addCount} activateTrig={activateTrig} setIsOpen={setIsOpen}/>
      </div>
    </div>
  );
}

export default AllPoll;
