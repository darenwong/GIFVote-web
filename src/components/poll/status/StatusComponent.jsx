import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import { useAuth0 } from "@auth0/auth0-react";
import { useSQL } from "../../../contexts/SQLContext.js";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SignInPage from "../../SignInPage.js";
import CommentList from "./CommentList.jsx";
import CommentInput from "./CommentInput.jsx";
import LikeButton from "./LikeButton.jsx";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  comment: {
    marginLeft: "auto",
    textTransform: "none",
  },
  commentBox: {
    display: "flex",
    marginTop: theme.spacing(2),
  },
  vote: {
    marginRight: "auto",
    textTransform: "none",
  },
}));


export default function StatusComponent ({
  poll_id,
  user_id,
  totalVoteCount,
  user_liked,
  num_likes,
  comment_count,
  getDate
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const { isAuthenticated, user } = useAuth0();
  const { getComments, submitComment, userId } = useSQL();
  const [open, setOpen] = useState(false);

  const handleComment = async () => {
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
      setOpen(true);
      return;
    }

    const response = await submitComment({ poll_id, user_id: userId, comment });
    if (response == "OK") {
      const result = await getComments(poll_id);
      if (result) {
        setComments(result);
      }
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
          <CommentList comments={comments} getDate={getDate}/>
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

