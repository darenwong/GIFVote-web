import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  TextField,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
}));

export default function CommentInput ({ handleSubmitComment }) {
  const classes = useStyles();
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