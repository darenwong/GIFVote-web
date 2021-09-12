import React, {useState, useRef, useEffect} from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Box, Button, Card, Collapse, Divider, IconButton, List, ListItem, ListItemText, TextField} from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BarChart from './BarChart.js';
import LeafChart from './LeafChart.js';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import PersonIcon from '@material-ui/icons/Person';
import ScheduleIcon from '@material-ui/icons/Schedule';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import SendIcon from '@material-ui/icons/Send';
import { useAuth0 } from '@auth0/auth0-react';
import { useSignIn } from '../contexts/SignInContext';
import { useSQL } from '../contexts/SQLContext.js';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "auto"
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  button: {
    margin: theme.spacing(1),
    textTransform: "none",
  },
  buttonGroup: {
    margin: theme.spacing(1),
    maxHeight: "30vh",
    overflow: "scroll"
  },
  barChart: {
    maxHeight: "20vh",
    overflow: "scroll",
  },
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    verticalAlign: "middle"
  },
  comment: {
    marginLeft: 'auto',
    textTransform: 'none'
  },
  commentBox:{
    display: "flex",
    marginTop: theme.spacing(2)
  },
  like: {
    marginRight: "auto",
    textTransform: "none"
  },
  list: {
    maxHeight: '30vh',
    overflow: 'scroll',
    backgroundColor: '#f5f5f5',
  }
}));

const areEqual = (prev, cur) => {
  /*
  console.log("compare", prev.title === cur.title, prev.created_by === cur.created_by, prev.created_at === cur.created_at, prev.user_id===cur.user_id, JSON.stringify(prev.data) === JSON.stringify(cur.data), prev.poll_id === cur.poll_id, prev.isVoted_bool === cur.isVoted_bool, JSON.stringify(prev.chartData) === JSON.stringify(cur.chartData));
  if (prev.data != cur.data){
    console.log("data", JSON.stringify(prev.data), JSON.stringify(cur.data), JSON.stringify(prev.data) === JSON.stringify(cur.data));
  }
  if (prev.chartData != cur.chartData){
    console.log("chartData", JSON.stringify(prev.chartData), JSON.stringify(cur.chartData), JSON.stringify(prev.chartData) === JSON.stringify(cur.chartData));
  }*/
  //console.log("check addCount",prev.addCount, cur.addCount, prev.addCount === cur.addCount)
  return prev.title === cur.title && prev.created_by === cur.created_by && prev.created_at === cur.created_at && prev.user_id===cur.user_id && JSON.stringify(prev.data) == JSON.stringify(cur.data) && prev.poll_id === cur.poll_id && prev.isVoted_bool === cur.isVoted_bool && JSON.stringify(prev.chartData) == JSON.stringify(cur.chartData) && prev.comment_count == cur.comment_count && prev.gifURL == cur.gifURL && prev.num_likes == cur.num_likes && prev.user_liked == cur.user_liked;
}

const Poll = React.memo(({gifURL, addCount, title, created_by, created_at, user_id, winner, data, poll_id, isVoted_bool, isVoted_option_id, chartData, totalVoteCount, comment_count, num_likes, user_liked}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const {loginWithRedirect, isAuthenticated} = useAuth0();
  const [signInOpen, setSignInOpen, signInMsg, setSignInMsg] = useSignIn();
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { getUserData, getDataset, updateDataset, refreshDataset, handleFetchMoreData, isPersonal, setIsPersonal, hasMore, userId, setSortBy, submitVote, getComments, submitComment, submitLike} = useSQL();

/*
  useEffect(() => {
    if (isVisible) {
      videoRef.current.play();
    } else {
      if (videoRef.current.play) {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);
*/
  const handleVote = async(event, option_id) => {
    if (!isAuthenticated){
      setSignInMsg("Sign in to vote");
      setSignInOpen(true);
      return ;
    }

    const result = await submitVote({user_id, poll_id, option_id});
    console.log("voted", option_id, result);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getDate = (date) => {
    const a = new Date(date);
    const b = new Date();
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    let sec_diff = Math.floor((utc2 - utc1) / 1000);
    let day_diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    if (sec_diff < 60){return Math.round(sec_diff)+"s"}
    else if (sec_diff < 3600){return Math.round(sec_diff/60)+"m"}
    else if (sec_diff < 86400){return Math.round(sec_diff/86400)+"h"}
    else if (day_diff < 7){return Math.round(day_diff)+"d"}
    else if (day_diff < 365){return Math.round(day_diff/7)+"w"}
    else {return Math.round(day_diff/365)+"y"}
  }


  const handleComment = async() => {
    if (expanded == false){
      const results = await getComments(poll_id);
      if (results) {
        setComments(results);
      }
    }

    setExpanded(!expanded);
  }

  const handleSubmitComment = async() => {
    if (!isAuthenticated){
      setSignInMsg("Sign in to comment");
      setSignInOpen(true);
      return ;
    }

    const response = await submitComment({poll_id, user_id, comment});
    if (response == "OK"){
      const result = await getComments(poll_id);
      if (result) {
        setComments(result);
      }
      setComment("");
    }
  }

  const handleLike = async() => {
    if (!isAuthenticated){
      setSignInMsg("Sign in to like");
      setSignInOpen(true);
      return ;
    }    

    const response = await submitLike({poll_id, user_id});
    console.log("submit like", response)
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2" paragraph>
          {poll_id +". "+ title}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" className={classes.subtitle}>
          <PersonIcon style={{margin: "10px"}}/>{created_by} <ScheduleIcon style={{margin: "10px"}}/> {getDate(created_at)} <WhatshotIcon style={{margin: "10px"}}/>{totalVoteCount}
        </Typography>
      </CardContent>
        <video width="90%" height="auto" loop muted autoPlay playsInline>
          <source src={gifURL}/>
        </video>
      {false &&
      <CardActions>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Vote Now"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      }
      {isVoted_bool==1 && 
        <CardContent className={classes.barChart}>
          <BarChart data={chartData}/>
        </CardContent>
      }
      {isVoted_bool==2 &&
        <List component="nav" aria-label="main choices">
          {data.map(({text, option_id}, index)=>
            <ListItem key={index} button onClick={(event)=>handleVote(event, option_id)}>
              <ListItemText primary={text} inset/>
            </ListItem>
          )}
        </List>
      }
      <Box className={classes.buttonGroup}>
        {isVoted_bool==0 &&
            data.map(({text, option_id}, index)=>
              <Button key={index} variant="outlined" color="primary" className={classes.button} onClick={(event)=>handleVote(event, option_id)}>
                {text}
              </Button>
            )
        }
      </Box>
      <Divider/>
      <CardActions disableSpacing>
        <Button
          className={classes.like} 
          onClick={handleLike}
          startIcon={(user_liked==1)? <FavoriteIcon color='secondary'/> :<FavoriteBorderIcon/>}
        >
          {num_likes} {(num_likes == 1)?" Like":"Likes"}
        </Button>
        <Button
          className={classes.comment} 
          onClick={handleComment}
          startIcon={(expanded == true)? <ChatBubbleIcon color='primary'/> :<ChatBubbleOutlineIcon/>}
        >
          {comment_count} {(comment_count == 1)?" Comment":"Comments"}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <List className={classes.list} dense>
            {comments.map(({user_name, created_at, comment_text}, index)=>
              <ListItem key={index}>
                <ListItemText primary={user_name +' ' + getDate(created_at) + ' ago'} secondary={comment_text}/>
              </ListItem>
            )}           
          </List>
          <Divider/>
          <Box className={classes.commentBox}>
            <TextField 
              label="Add a comment..." 
              variant="outlined" 
              value={comment} 
              onChange={(event)=>{
                event.preventDefault();
                setComment(event.target.value);
              }}
              fullWidth
            />
            <IconButton color="primary" onClick={handleSubmitComment}>
              <SendIcon/>
            </IconButton>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}, areEqual);
export default Poll;