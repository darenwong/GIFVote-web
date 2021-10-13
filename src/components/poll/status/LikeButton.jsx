import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
} from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useSQL } from "../../../contexts/SQLContext.js";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SignInPage from "../../SignInPage.js";

const useStyles = makeStyles((theme) => ({
  like: {
    marginRight: "auto",
    marginLeft: "auto",
    textTransform: "none",
  },
}));

export default function LikeButton ({ user_liked, num_likes, poll_id }) {
  const classes = useStyles();
  const { submitLike, userId } = useSQL();
  const { isAuthenticated } = useAuth0();
  const [open, setOpen] = useState(false);


  const handleLike = async () => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    const response = await submitLike({ poll_id, user_id: userId });
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
