import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, IconButton } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { useAuth0 } from "@auth0/auth0-react";
import { useSignIn } from "../contexts/SignInContext";
import { useSQL } from "../contexts/SQLContext.js";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    padding: theme.spacing(1),
  },
  optionContainer: {
    display: "flex",
    justifyContent: "center",
  },
  addOptionButton: {
    textTransform: "none",
    margin: theme.spacing(1),
  },
  formButton: {
    textTransform: "none",
  },
}));

export default function FormDialog() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([
    { val: "", err: "" },
    { val: "", err: "" },
  ]);
  const [question, setQuestion] = useState({ val: "", err: "" });
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { setSignInOpen, setSignInMsg } = useSignIn();
  const { refreshDataset, submitPoll, userId } = useSQL();
  const history = useHistory();

  const handleClickOpen = () => {
    if (!isAuthenticated) {
      setSignInMsg("Sign in to create poll");
      setSignInOpen(true);
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOptions([
      { val: "", err: "" },
      { val: "", err: "" },
    ]);
    setQuestion({ val: "", err: "" });
    setOpen(false);
  };

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, { val: "", err: "" }]);
    }
  };

  const handleOptionField = (event, index) => {
    event.preventDefault();
    if (event.target.value.length > 20) {
      return;
    }

    let temp = [...options];
    temp[index] = { val: event.target.value, err: "" };
    setOptions(temp);
    console.log(event.target.value, index);
  };

  const handleDeleteField = (event, index) => {
    event.preventDefault();
    let temp = [...options];
    temp.splice(index, 1);
    setOptions(temp);
  };

  const handleCreatePoll = async () => {
    if (question.val.trim() == "") {
      setQuestion({ val: question.val, err: "Cannot be blank" });
      return;
    }
    for (let i = 0; i < options.length; i++) {
      if (options[i].val.trim() == "") {
        let temp = [...options];
        temp[i].err = "Cannot be blank";
        setOptions(temp);
        return;
      }
    }

    let temp = [...options];
    for (let i = 0; i < temp.length; i++) {
      temp[i] = temp[i].val.trim();
    }

    const response = await submitPoll({
      user_id: userId,
      question: question.val.trim(),
      options: JSON.stringify(temp),
    });
    if (response == "OK") {
      refreshDataset();
      handleClose();
      history.push("/your");
    }
  };

  return (
    <div className={classes.root}>
      <IconButton
        color="inherit"
        aria-label="new poll"
        component="span"
        onClick={handleClickOpen}
        className={classes.button}
      >
        <AddBoxOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New Poll</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={question.err != ""}
            helperText={question.err}
            margin="dense"
            id="name"
            label="Question"
            value={question.val}
            onChange={(event) =>
              setQuestion({
                val: event.target.value.slice(
                  0,
                  Math.min(event.target.value.length, 50)
                ),
                err: "",
              })
            }
            fullWidth
          />

          {options.map(({ val, err }, index) => (
            <Box key={index} className={classes.optionContainer}>
              <TextField
                error={err != ""}
                helperText={err}
                margin="dense"
                id="name"
                label={"Option " + (index + 1)}
                value={val}
                onChange={(event) => handleOptionField(event, index)}
                fullWidth
              />
              <IconButton
                aria-label="delete"
                onClick={(event) => handleDeleteField(event, index)}
                disabled={index in [0, 1]}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            className={classes.addOptionButton}
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddOption}
            disabled={options.length >= 10}
          >
            Add Option
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            className={classes.formButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePoll}
            color="primary"
            variant="contained"
            className={classes.formButton}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
