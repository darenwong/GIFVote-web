import "./App.css";
import {
  Button,
  Grid,
  Paper,
  Snackbar,
  Slide,
  Dialog,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import Poll from "./components/poll/Poll.jsx";
import PollForm from "./components/PollForm.js";
import DropdownMenu from "./components/DropdownMenu";
import TopBar from "./components/topBar/TopBar";
import SignInPage from "./components/SignInPage";
import { useAuth0 } from "@auth0/auth0-react";
import { useSQL } from "./contexts/SQLContext";
import { LocalDiningOutlined } from "@material-ui/icons";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  Redirect,
} from "react-router-dom";
import PollPage from "./components/PollPage";
import UserPollPage from "./components/UserPollPage";
import BotBar from "./components/topBar/BotBar";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const userName = "Daren";
const userEmail = "daren@gmail.com";
const userId = "2";

function App() {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
  const {
    data,
    getUserData,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    isPersonal,
    setIsPersonal,
    hasMore,
    userId,
    setSortBy,
  } = useSQL();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(async () => {
    if (isAuthenticated) {
      console.log("authenticated!", user);
      setSnackbarOpen(true);

      const results = await getUserData(user);

      //console.log("user data", results);
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <TopBar />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message="Signed In!"
          TransitionComponent={Slide}
        />

        <SignInPage />
        <Switch>
          <Route
            exact
            path="/profile/:userid"
            render={(routeProps) => (
              <UserPollPage
                personal={1}
                sortBy={"like"}
                isFollowing={0}
                key={routeProps.match.params.userid}
                userid={routeProps.match.params.userid}
              />
            )}
          ></Route>
          <Route
            path="/home"
            render={() => {
              return isAuthenticated ? (
                <PollPage
                  personal={0}
                  sortBy={"time"}
                  isFollowing={1}
                  key={userId}
                />
              ) : (
                <Redirect to="/" />
              );
            }}
          ></Route>
          <Route path="/">
            <PollPage personal={0} sortBy={"vote"} isFollowing={0} />
          </Route>
        </Switch>
        <BotBar />
      </div>
    </Router>
  );
}

export default App;

/*
        <Switch>
          <Route path="/">
            <AllPoll userId={userId} isOpen={false} setIsOpen={setIsOpen}/>
          </Route>
          <Route path="/your">
            <MyPoll userId={userId} isOpen={true} setIsOpen={setIsOpen}/>
          </Route>
        </Switch>*/
