import React from "react";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import FixedListTest from "./FixedListTest";
import FlexListTest from "./FlexListTest";
import FlexListAPI from "./FlexListAPI";
import AppTest from "./AppTest";

import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";
import { SignInProvider } from "./contexts/SignInContext";
import { SQLProvider } from "./contexts/SQLContext";
import { defaults } from "react-chartjs-2";
import { LaptopWindowsSharp } from "@material-ui/icons";
defaults.font.family = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(",");
defaults.font.size = 10;
console.log("default", defaults);

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
console.log("domain", domain, clientId);

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#22bfa0",
    },
  },
});

const dev = "https://localhost:3000";
const prod = "https://darenwong.github.io/GIFVote-web/";

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
  >
    <SignInProvider>
      <SQLProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </SQLProvider>
    </SignInProvider>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
