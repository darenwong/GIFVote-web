import React, { useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
} from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useSQL } from "../../../contexts/SQLContext.js";
import SignInPage from "../../SignInPage.js";


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    textTransform: "none",
    whiteSpace: "nowrap",
  },
}));



export default function VoteButton ({ text, option_id, user_id, poll_id }) {
  const classes = useStyles();
  const { submitVote, userId } = useSQL();
  const { isAuthenticated } = useAuth0();
  const [open, setOpen] = useState(false);

  const handleVote = async (event, option_id) => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    const result = await submitVote({ user_id: userId, poll_id, option_id });
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