import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useAuth0 } from '@auth0/auth0-react';
import { useSignIn } from '../contexts/SignInContext';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect({isOpen, setIsOpen}) {
  const classes = useStyles();
  const {isAuthenticated} = useAuth0();
  const [signInOpen, setSignInOpen, signInMsg, setSignInMsg] = useSignIn();

  const handleChange = (event) => {
    if (event.target.value == false && !isAuthenticated){
      setSignInMsg("Sign in to see your polls");
      setSignInOpen(true);
      return ;
    }
    setIsOpen(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={isOpen}
          onChange={handleChange}
        >
          <MenuItem value={true}>All Polls</MenuItem>
          <MenuItem value={false}>Your Polls</MenuItem>
        </Select>
      </FormControl>
    </div>
    )
  }