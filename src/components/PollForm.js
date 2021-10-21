import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pollActions, submitPoll } from "../store/pollSlice";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, CircularProgress, IconButton } from "@material-ui/core";
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
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory, useLocation } from "react-router-dom";
import SignInPage from "./SignInPage.js";

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
  circularProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-12px",
    marginLeft: "-12px",
  },
}));

export default function FormDialog() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [options, setOptions] = useState([
    { val: "", err: "" },
    { val: "", err: "" },
  ]);
  const dispatch = useDispatch();
  const [question, setQuestion] = useState({ val: "", err: "" });
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const userId = useSelector((state) => state.user.userId);
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const handleClickOpen = () => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setOptions([
      { val: "", err: "" },
      { val: "", err: "" },
    ]);
    setQuestion({ val: "", err: "" });
    setDialogOpen(false);
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
    setIsSubmitting(true);
    const response = await dispatch(
      submitPoll({
        user_id: userId,
        question: question.val.trim(),
        options: JSON.stringify(temp),
      })
    );

    if (response == "OK") {
      //refreshDataset();
      handleClose();
      if (location.pathname == `/profile/${userId}`) {
        dispatch(pollActions.refreshDataset());
      } else {
        history.push(`/profile/${userId}`);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className={classes.root}>
      <SignInPage
        signInMsg={"Sign in to create poll"}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <IconButton
        color="inherit"
        aria-label="new poll"
        component="span"
        onClick={handleClickOpen}
        className={classes.button}
      >
        {dialogOpen && <AddBoxIcon />}
        {!dialogOpen && <AddBoxOutlinedIcon />}
      </IconButton>
      <Dialog
        open={dialogOpen}
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
          <Box style={{ position: "relative" }}>
            <Button
              onClick={handleCreatePoll}
              color="primary"
              variant="contained"
              className={classes.formButton}
              disabled={isSubmitting}
            >
              Create
            </Button>

            {isSubmitting == true && (
              <CircularProgress
                className={classes.circularProgress}
                size={24}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
