import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
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
  Tooltip,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BarChart from "./BarChart.js";
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
import { Waypoint } from "react-waypoint";
import SignInPage from "./SignInPage.js";

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
    marginRight: theme.spacing(2),
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
    whiteSpace: "nowrap",
  },
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
  titleText: {
    textAlign: "start",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "& .MuiListItemText-primary": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "& .MuiListItemText-secondary": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  vote: {
    marginRight: "auto",
    textTransform: "none",
  },
}));

const areEqual = (prev, cur) => {
  /*
  //console.log(
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
    //console.log(
      "data",
      JSON.stringify(prev.data),
      JSON.stringify(cur.data),
      JSON.stringify(prev.data) === JSON.stringify(cur.data)
    );
  }
  if (prev.chartData != cur.chartData) {
    //console.log(
      "chartData",
      JSON.stringify(prev.chartData),
      JSON.stringify(cur.chartData),
      JSON.stringify(prev.chartData) === JSON.stringify(cur.chartData)
    );
  }*/
  ////console.log("check addCount",prev.addCount, cur.addCount, prev.addCount === cur.addCount)
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
    gifimage,
    gifHeight,
    gifWidth,
    title,
    created_by,
    user_avatar,
    created_at,
    user_id,
    data,
    poll_id,
    isVoted_bool,
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
            <NavLink
              className={classes.passiveLink}
              activeClassName={classes.activeLink}
              to={`/profile/${user_id}`}
            >
              <ListItemAvatar>
                <Avatar
                  alt={"Guest"}
                  className={classes.avatar}
                  src={user_avatar}
                >
                  <AccountCircle />
                </Avatar>
              </ListItemAvatar>
            </NavLink>
            <Tooltip title={title}>
              <ListItemText
                className={classes.titleText}
                primary={title}
                secondary={created_by + " " + getDate(created_at) + " ago"}
              />
            </Tooltip>
            <OptionDropdown />
          </Box>
        </CardContent>
        <GIFComponent
          gifURL={gifURL}
          gifimage={gifimage}
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
  (prev, cur) => {
    return (
      prev.gifURL == cur.gifURL &&
      prev.gifimage == cur.gifimage &&
      prev.gifHeight == cur.gifHeight &&
      prev.gifWidth == cur.gifWidth &&
      prev.title == cur.title &&
      prev.created_by == cur.created_by &&
      prev.user_avatar == cur.user_avatar &&
      prev.created_at == cur.created_at &&
      prev.user_id == cur.user_id &&
      JSON.toString(prev.data) == JSON.toString(cur.data) &&
      prev.poll_id == cur.poll_id &&
      prev.isVoted_bool == cur.isVoted_bool &&
      JSON.toString(prev.chartData) == JSON.toString(cur.chartData) &&
      prev.totalVoteCount == cur.totalVoteCount &&
      prev.comment_count == cur.comment_count &&
      prev.num_likes == cur.num_likes &&
      prev.user_liked == cur.user_liked
    );
  }
);
export default Poll;

const GIFComponent = ({
  gifURL,
  gifimage,
  gifHeight,
  gifWidth,
  isScrolling,
}) => {
  const [width, height] = useWindowSize();
  let videoContainerWidth = Math.min(600, Math.max(300, width * 0.5));
  let renderedVideoHeight = (gifHeight * videoContainerWidth) / gifWidth;
  let [shouldPlay, updatePlayState] = useState(false);
  const videoRef = useRef();

  let handleEnterViewport = function () {
    updatePlayState(true);
    setTimeout(() => {
      //console.log("timeout", shouldPlay, videoRef.current);
      if (videoRef && videoRef.current) {
        videoRef.current.handleClickPreview();
      }
    }, 1000);
  };
  let handleExitViewport = function () {
    updatePlayState(false);
    videoRef.current.showPreview();
  };

  return (
    <>
      <Waypoint
        onEnter={handleEnterViewport}
        onLeave={handleExitViewport}
        fireOnRapidScroll={false}
      >
        <div>
          <ReactPlayer
            ref={videoRef}
            width={videoContainerWidth}
            height={renderedVideoHeight}
            style={{ marginLeft: "auto", marginRight: "auto" }}
            url={gifURL}
            playing={shouldPlay}
            loop={true}
            muted={true}
            playsinline={true}
            light={gifimage}
            fallback={
              <CardMedia
                component="img"
                alt="fallback"
                width={videoContainerWidth}
                height={renderedVideoHeight}
                image={gifimage}
              />
            }
            config={{
              file: {
                attributes: {
                  poster: { gifimage },
                },
              },
            }}
          />
        </div>
      </Waypoint>
    </>
  );
  return (
    <img
      height={gifHeight}
      width={gifWidth}
      src="https://media3.giphy.com/media/jn2iXu2HRpMuovBrrV/100w_s.gif?cid=aac4a8203xs8ll7lrjdqby2gwinq8acqasltulj73gamuyvp&rid=100w_s.gif&ct=g"
    ></img>
  );
  return (
    <video width="90%" height="auto" loop muted autoPlay playsInline>
      <source src={gifURL} />
    </video>
  );
};

const VoteComponent = ({ data, isVoted_bool, chartData, user_id, poll_id }) => {
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

const VoteButton = ({ text, option_id, user_id, poll_id }) => {
  const classes = useStyles();
  const { submitVote, userId } = useSQL();
  const { isAuthenticated } = useAuth0();
  //const { setSignInOpen, setSignInMsg } = useSignIn();
  const [open, setOpen] = useState(false);

  const handleVote = async (event, option_id) => {
    if (!isAuthenticated) {
      //setSignInMsg("Sign in to vote");
      //setSignInOpen(true);
      setOpen(true);
      return;
    }

    const result = await submitVote({ user_id: userId, poll_id, option_id });
    //console.log("voted", option_id, result);
  };

  return (
    <div>
      <SignInPage
        signInMsg={"Sign in to vote"}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={(event) => handleVote(event, option_id)}
      >
        {text}
      </Button>
    </div>
  );
};

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

const LikeComments = ({
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
  //const { setSignInOpen, setSignInMsg } = useSignIn();
  const { getComments, submitComment, userId } = useSQL();
  const [open, setOpen] = useState(false);

  const handleComment = async () => {
    //console.log("comment clicked");
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
      //setSignInMsg("Sign in to comment");
      setOpen(true);
      return;
    }

    const response = await submitComment({ poll_id, user_id: userId, comment });
    if (response == "OK") {
      const result = await getComments(poll_id);
      if (result) {
        setComments(result);
      }
      //setComment("");
    }
  };

  return (
    <div>
      <SignInPage
        signInMsg={"Sign in to comment"}
        open={open}
        handleClose={() => setOpen(false)}
      />
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
    </div>
  );
};

const CommentList = ({ comments }) => {
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
};

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
          handleSubmitComment(comment).then(() => setComment(""));
        }}
      >
        <SendIcon />
      </IconButton>
    </>
  );
};

const LikeButton = ({ user_liked, num_likes, poll_id, user_id }) => {
  const classes = useStyles();
  const { submitLike, userId } = useSQL();
  const { isAuthenticated } = useAuth0();
  //const { setSignInOpen, setSignInMsg } = useSignIn();
  const [open, setOpen] = useState(false);

  const submitLikeMemoized = React.useCallback(() => {
    submitLike({ poll_id, user_id: userId });
  }, [poll_id, userId]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      //setSignInMsg("Sign in to like");
      setOpen(true);
      console.log("like", isAuthenticated, open);
      return;
    }

    const response = await submitLike({ poll_id, user_id: userId });
    //const response = await submitLikeMemoized();
    //console.log("submit like", response);
  };

  return (
    <div>
      <SignInPage
        signInMsg={"Sign in to like"}
        open={open}
        handleClose={() => setOpen(false)}
      />
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
    </div>
  );
};

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

  ////console.log(a, b, utc1, utc2, sec_diff, day_diff, title + poll_id);
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
