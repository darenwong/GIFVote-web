import React, { useState } from "react";
import { pollActions, submitLike } from "../../../store/pollSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
} from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SignInPage from "../../SignInPage.js";
import { useEffect } from "react";
import { useRef } from "react";

const useStyles = makeStyles((theme) => ({
  like: {
    marginRight: "auto",
    marginLeft: "auto",
    textTransform: "none",
  },
}));


export default function LikeButton ({ user_liked, num_likes, poll_id }) {
  const classes = useStyles();
  const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth0();
  const [open, setOpen] = useState(false);
  const initial = useRef(true);

  useEffect(()=>{
    if (initial.current == true){
      initial.current = false
      return;
    }

    const timer = setTimeout(()=>{
      dispatch(submitLike({ poll_id, user_id: userId, user_liked }));

    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [user_liked])

  const handleLike = async () => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    try {
      dispatch(pollActions.updateLike({pollId:poll_id}));

    }catch(error){
      console.log("submitLike error", error)
    }
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
