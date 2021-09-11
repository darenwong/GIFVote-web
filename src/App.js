import './App.css';
import {Button, Grid, Paper, Snackbar, Slide, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useRef } from 'react';
import Poll from './components/Poll.js';
import PollForm from './components/PollForm.js';
import InfiniteScroll from "react-infinite-scroll-component";
import AllPoll from './components/AllPoll.js';
import MyPoll from './components/MyPoll.js';
import DropdownMenu from './components/DropdownMenu';
import TopBar from './components/TopBar';
import SignInPage from './components/SignInPage';
import { useAuth0 } from '@auth0/auth0-react';
import { LocalDiningOutlined } from '@material-ui/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
  },
}));

const userName = "Daren"
const userEmail = "daren@gmail.com"
const userId = "2"

function App() {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const {isAuthenticated, user, logout, isLoading} = useAuth0();
  const [userId, setUserId] = useState("507");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(()=>{
    if (isAuthenticated){

      console.log("authenticated!", user);
      setSnackbarOpen(true);
      fetch(`http://localhost:8080/api-get-user/?user_email=${user.email}&user_name=${user.nickname}`, {method: 'POST'})
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then(
        (results) => { 
          console.log("userId = ", results);
          if (results && results[0] && results[0].id){
            setUserId(String(results[0].id));
          } else {
            logout();
          }
        }
      )
      .catch(console.log)
    }
  }, [isAuthenticated])

  return (
    <Router>
      <div className="App">
        <TopBar isOpen={isOpen} setIsOpen={setIsOpen}/>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={()=>setSnackbarOpen(false)} message="Signed In!" TransitionComponent={Slide}/>

        <SignInPage/>
        {isOpen &&
          <AllPoll userId={userId} isOpen={isOpen} setIsOpen={setIsOpen}/>
        }
        {!isOpen &&
          <MyPoll userId={userId} isOpen={isOpen} setIsOpen={setIsOpen}/>
        }
        {false &&
        <Switch>
          <Route path="/">
            <AllPoll userId={userId} isOpen={false} setIsOpen={setIsOpen}/>
          </Route>
          <Route path="/your">
            <MyPoll userId={userId} isOpen={true} setIsOpen={setIsOpen}/>
          </Route>
        </Switch>
        }
      </div>
    </Router>
  );
}

export default App;
