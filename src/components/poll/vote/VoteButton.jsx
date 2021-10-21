import React, { useState} from "react";
import { submitVote } from "../../../store/pollSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
} from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import SignInPage from "../../SignInPage.js";


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    textTransform: "none",
    whiteSpace: "nowrap",
  },
}));

const areEqual = (prev, cur) => {
  return prev.text == cur.text && prev.option_id == cur.option_id && prev.poll_id == cur.poll_id
}

const VoteButton = React.memo(({ text, option_id, poll_id }) => {
  const classes = useStyles();
  const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();

  const { isAuthenticated } = useAuth0();
  const [open, setOpen] = useState(false);

  const handleVote = async (event, option_id) => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    dispatch(submitVote({ user_id: userId, poll_id, option_id }));
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
}, areEqual);

export default VoteButton