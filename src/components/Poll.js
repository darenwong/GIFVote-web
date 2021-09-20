import React, { useState, useRef, useEffect } from "react";
import VisibilitySensor from "react-visibility-sensor";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BarChart from "./BarChart.js";
import LeafChart from "./LeafChart.js";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import PersonIcon from "@material-ui/icons/Person";
import ScheduleIcon from "@material-ui/icons/Schedule";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import SendIcon from "@material-ui/icons/Send";
import { useAuth0 } from "@auth0/auth0-react";
import { useSignIn } from "../contexts/SignInContext";
import { useSQL } from "../contexts/SQLContext.js";
import { useWindowSize } from "@react-hook/window-size/throttled";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from "@material-ui/icons/Share";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import AccountCircle from "@material-ui/icons/AccountCircle";

const ENDPOINT = "https://gif-vote.herokuapp.com";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50vw",
    minWidth: "300px",
    maxWidth: "600px",
    marginBottom: "auto",
    marginTop: "auto",
  },
  avatar: {
    margin: theme.spacing(1),
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
    opacity: 1,
  },
  "@keyframes fade": {
    "0%, 100%": { opacity: 0 },
    "50%": { opacity: 1 },
  },
  pos: {
    marginBottom: 12,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  button: {
    margin: theme.spacing(1),
    textTransform: "none",
  },
  buttonGroup: {
    display: "block",
  },
  buttonGroupContainer: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      height: "100px",
    },
    [theme.breakpoints.up("md")]: {
      height: "200px",
    },
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  barChart: {
    [theme.breakpoints.down("md")]: {
      height: "100px",
    },
    [theme.breakpoints.up("md")]: {
      height: "200px",
    },
    width: "90%",
    overflowY: "scroll",
    overflowX: "hidden",
    padding: "unset",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    verticalAlign: "middle",
  },
  comment: {
    marginLeft: "auto",
    textTransform: "none",
  },
  commentBox: {
    display: "flex",
    marginTop: theme.spacing(2),
  },
  like: {
    marginRight: "auto",
    marginLeft: "auto",
    textTransform: "none",
  },
  list: {
    maxHeight: "50vh",
    overflow: "scroll",
    backgroundColor: "#f5f5f5",
  },
  moreButton: {
    marginLeft: "auto",
    padding: theme.spacing(0.5),
  },
  titleBox: {
    display: "flex",
    alignItems: "flex-start",
  },
  vote: {
    marginRight: "auto",
    textTransform: "none",
  },
}));

const areEqual = (prev, cur) => {
  /*
  console.log(
    "compare",
    prev.title === cur.title,
    prev.created_by === cur.created_by,
    prev.created_at === cur.created_at,
    prev.user_id === cur.user_id,
    JSON.stringify(prev.data) == JSON.stringify(cur.data),
    prev.poll_id === cur.poll_id,
    prev.isVoted_bool === cur.isVoted_bool,
    JSON.stringify(prev.chartData) == JSON.stringify(cur.chartData),
    prev.comment_count == cur.comment_count,
    prev.gifURL == cur.gifURL,
    prev.num_likes == cur.num_likes,
    prev.user_liked == cur.user_liked
  );
  if (prev.data != cur.data) {
    console.log(
      "data",
      JSON.stringify(prev.data),
      JSON.stringify(cur.data),
      JSON.stringify(prev.data) === JSON.stringify(cur.data)
    );
  }
  if (prev.chartData != cur.chartData) {
    console.log(
      "chartData",
      JSON.stringify(prev.chartData),
      JSON.stringify(cur.chartData),
      JSON.stringify(prev.chartData) === JSON.stringify(cur.chartData)
    );
  }*/
  //console.log("check addCount",prev.addCount, cur.addCount, prev.addCount === cur.addCount)
  return (
    prev.title === cur.title &&
    prev.created_by === cur.created_by &&
    prev.created_at === cur.created_at &&
    prev.user_id === cur.user_id &&
    JSON.stringify(prev.data) == JSON.stringify(cur.data) &&
    prev.poll_id === cur.poll_id &&
    prev.isVoted_bool === cur.isVoted_bool &&
    JSON.stringify(prev.chartData) == JSON.stringify(cur.chartData) &&
    prev.comment_count == cur.comment_count &&
    prev.gifURL == cur.gifURL &&
    prev.num_likes == cur.num_likes &&
    prev.user_liked == cur.user_liked
  );
};

const Poll = React.memo(
  ({
    gifURL,
    gifHeight,
    gifWidth,
    addCount,
    title,
    created_by,
    user_avatar,
    created_at,
    user_id,
    winner,
    data,
    poll_id,
    isVoted_bool,
    isVoted_option_id,
    chartData,
    totalVoteCount,
    comment_count,
    num_likes,
    user_liked,
  }) => {
    const classes = useStyles();
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

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

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Box className={classes.titleBox}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  alt={"Guest"}
                  className={classes.avatar}
                  src={user_avatar}
                >
                  <AccountCircle />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={title}
                secondary={created_by + " " + getDate(created_at) + " ago"}
              />
            </ListItem>
            <OptionDropdown />
          </Box>
        </CardContent>
        <GIFComponent
          gifURL={gifURL}
          gifHeight={gifHeight}
          gifWidth={gifWidth}
        />
        <VoteComponent
          user_id={user_id}
          poll_id={poll_id}
          data={data}
          isVoted_bool={isVoted_bool}
          chartData={chartData}
        />
        <Divider />
        <LikeComments
          poll_id={poll_id}
          user_id={user_id}
          totalVoteCount={totalVoteCount}
          user_liked={user_liked}
          num_likes={num_likes}
          comment_count={comment_count}
        />
      </Card>
    );
  },
  areEqual
);
export default Poll;

const GIFComponent = React.memo(
  ({ gifURL, gifHeight, gifWidth }) => {
    return (
      <video width="90%" height="auto" loop muted autoPlay playsInline>
        <source src={gifURL} />
      </video>
    );
  },
  (prev, cur) => {
    return prev.gifURL == cur.gifURL;
  }
);

const VoteComponent = React.memo(
  ({ data, isVoted_bool, chartData, user_id, poll_id }) => {
    const classes = useStyles();

    return (
      <>
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
      </>
    );
  },
  (prev, cur) => {
    return (
      prev.user_id == cur.user_id &&
      prev.poll_id == cur.poll_id &&
      JSON.stringify(prev.data) == JSON.stringify(cur.data) &&
      prev.isVoted_bool == cur.isVoted_bool &&
      JSON.stringify(prev.chartData) == JSON.stringify(cur.chartData)
    );
  }
);

const VoteButton = React.memo(
  ({ text, option_id, user_id, poll_id }) => {
    const classes = useStyles();
    const { submitVote, userId } = useSQL();
    const { isAuthenticated } = useAuth0();
    const { setSignInOpen, setSignInMsg } = useSignIn();

    const handleVote = async (event, option_id) => {
      if (!isAuthenticated) {
        setSignInMsg("Sign in to vote");
        setSignInOpen(true);
        return;
      }

      const result = await submitVote({ user_id: userId, poll_id, option_id });
      console.log("voted", option_id, result);
    };

    return (
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={(event) => handleVote(event, option_id)}
      >
        {text}
      </Button>
    );
  },
  (prev, cur) => {
    return (
      prev.text == cur.text &&
      prev.option_id == cur.option_id &&
      prev.user_id == cur.user_id &&
      prev.poll_id == cur.poll_id
    );
  }
);

const OptionDropdown = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton className={classes.moreButton} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {false && (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
        )}
        <MenuItem>
          <Button
            href="mailto:gifvote0@gmail.com"
            style={{ textTransform: "none" }}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText>Report</ListItemText>
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

const LikeComments = React.memo(
  ({
    poll_id,
    user_id,
    totalVoteCount,
    user_liked,
    num_likes,
    comment_count,
  }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [comments, setComments] = useState([]);
    const { isAuthenticated, user } = useAuth0();
    const { setSignInOpen, setSignInMsg } = useSignIn();
    const { getComments, submitComment } = useSQL();

    const handleComment = async () => {
      console.log("comment clicked");
      if (expanded == false) {
        const results = await getComments(poll_id);
        if (results) {
          setComments(results);
        }
      }

      setExpanded(!expanded);
    };

    const handleSubmitComment = async (comment) => {
      if (!isAuthenticated) {
        setSignInMsg("Sign in to comment");
        setSignInOpen(true);
        return;
      }

      const response = await submitComment({ poll_id, user_id, comment });
      if (response == "OK") {
        const result = await getComments(poll_id);
        if (result) {
          setComments(result);
        }
        //setComment("");
      }
    };

    return (
      <>
        <CardActions disableSpacing>
          <Button className={classes.vote} startIcon={<WhatshotIcon />}>
            {totalVoteCount} {totalVoteCount == 1 ? " Vote" : "Votes"}
          </Button>
          <LikeButton
            user_liked={user_liked}
            num_likes={num_likes}
            poll_id={poll_id}
            user_id={user_id}
          />
          <Button
            className={classes.comment}
            onClick={handleComment}
            startIcon={
              expanded == true ? (
                <ChatBubbleIcon color="primary" />
              ) : (
                <ChatBubbleOutlineIcon />
              )
            }
          >
            {comment_count} {comment_count == 1 ? " Comment" : "Comments"}
          </Button>
        </CardActions>
        <Dialog open={expanded} onClose={() => setExpanded(false)}>
          <CardContent>
            <CommentList comments={comments} />
            <Divider />
            <Box className={classes.commentBox}>
              {isAuthenticated && (
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  className={classes.avatar}
                />
              )}
              {!isAuthenticated && (
                <Avatar alt={"Guest"} className={classes.avatar}>
                  <AccountCircle />
                </Avatar>
              )}

              <CommentInput handleSubmitComment={handleSubmitComment} />
            </Box>
          </CardContent>
        </Dialog>
      </>
    );
  },
  (prev, cur) => {
    return (
      prev.poll_id == cur.poll_id &&
      prev.user_id == cur.user_id &&
      prev.totalVoteCount == cur.totalVoteCount &&
      prev.user_liked == cur.user_liked &&
      prev.num_likes == cur.num_likes &&
      prev.comment_count == cur.comment_count
    );
  }
);

const CommentList = React.memo(
  ({ comments }) => {
    const classes = useStyles();
    return (
      <List className={classes.list} dense>
        {comments.map(
          ({ user_name, created_at, user_avatar, comment_text }, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar src={user_avatar} />
              </ListItemAvatar>
              <ListItemText
                secondary={user_name + " " + getDate(created_at) + " ago"}
                primary={comment_text}
              />
            </ListItem>
          )
        )}
      </List>
    );
  },
  (prev, cur) => {
    return JSON.stringify(prev.comments) == JSON.stringify(cur.comments);
  }
);

const CommentInput = ({ handleSubmitComment }) => {
  const [comment, setComment] = useState("");

  return (
    <>
      <TextField
        label="Add a comment..."
        variant="outlined"
        value={comment}
        onChange={(event) => {
          event.preventDefault();
          setComment(event.target.value);
        }}
        fullWidth
      />

      <IconButton
        color="primary"
        onClick={() => {
          handleSubmitComment(comment);
        }}
      >
        <SendIcon />
      </IconButton>
    </>
  );
};

const LikeButton = React.memo(
  ({ user_liked, num_likes, poll_id, user_id }) => {
    const classes = useStyles();
    const { submitLike, userId } = useSQL();
    const { isAuthenticated } = useAuth0();
    const { setSignInOpen, setSignInMsg } = useSignIn();

    const handleLike = async () => {
      if (!isAuthenticated) {
        setSignInMsg("Sign in to like");
        setSignInOpen(true);
        return;
      }

      const response = await submitLike({ poll_id, user_id: userId });
      console.log("submit like", response);
    };

    return (
      <Button
        className={classes.like}
        onClick={handleLike}
        startIcon={
          user_liked == 1 ? (
            <FavoriteIcon color="secondary" />
          ) : (
            <FavoriteBorderIcon />
          )
        }
      >
        {num_likes} {num_likes == 1 ? " Like" : "Likes"}
      </Button>
    );
  },
  (prev, cur) => {
    console.log(
      "likeompare",
      prev.user_liked == cur.user_liked,
      prev.num_likes == cur.num_likes,
      prev.poll_id == cur.poll_id,
      prev.user_id == cur.user_id
    );
    return (
      prev.user_liked == cur.user_liked &&
      prev.num_likes == cur.num_likes &&
      prev.poll_id == cur.poll_id &&
      prev.user_id == cur.user_id
    );
  }
);

const getDate = (date) => {
  const a = new Date(date);
  const b = new Date();

  const utc1 = Date.UTC(
    a.getFullYear(),
    a.getMonth(),
    a.getDate(),
    a.getHours(),
    a.getMinutes(),
    a.getSeconds()
  );
  const utc2 = Date.UTC(
    b.getFullYear(),
    b.getMonth(),
    b.getDate(),
    b.getHours(),
    b.getMinutes(),
    b.getSeconds()
  );
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  let sec_diff = Math.floor((utc2 - utc1) / 1000);
  let day_diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);

  //console.log(a, b, utc1, utc2, sec_diff, day_diff, title + poll_id);
  if (sec_diff < 60) {
    return Math.round(sec_diff) + "s";
  } else if (sec_diff < 3600) {
    return Math.round(sec_diff / 60) + "m";
  } else if (sec_diff < 86400) {
    return Math.round(sec_diff / 3600) + "h";
  } else if (day_diff < 7) {
    return Math.round(day_diff) + "d";
  } else if (day_diff < 365) {
    return Math.round(day_diff / 7) + "w";
  } else {
    return Math.round(day_diff / 365) + "y";
  }
};
