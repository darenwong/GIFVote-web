import { Snackbar, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSQL } from "./contexts/SQLContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import TopBar from "./components/topBar/TopBar";
import BotBar from "./components/topBar/BotBar";
import SignInPage from "./components/SignInPage";
import PollPage from "./pages/homePollPage/PollPage.jsx";
import UserPollPage from "./pages/userPollPage/UserPollPage.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    height: "100vh",
    width: "100vw",
    overflowY: "hidden",
  },
}));

function App() {
  const classes = useStyles();
  const { isAuthenticated, user } = useAuth0();
  const { getUserData, userId, setUserId } = useSQL();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const loggedInId = localStorage.getItem("userId");

    if (loggedInId) {
      setUserId(loggedInId);
    }
  }, []);

  useEffect(async () => {
    if (isAuthenticated) {
      console.log("authenticated!", user);
      setSnackbarOpen(true);

      if (!localStorage.getItem("userId")) {
        await getUserData(user);
      }
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className={classes.root}>
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
