import {
  Button,
  Card,
  Grid,
  Paper,
  Avatar,
  CardHeader,
  Box,
  Typography,
  Divider,
  Collapse,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import { useSQL } from "../contexts/SQLContext.js";
import { useAuth0 } from "@auth0/auth0-react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50vw",
    minWidth: "300px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(3),
  },
  summary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  summaryBoxRoot: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
  },
  avatar: {
    paddingLeft: theme.spacing(1),
    margin: theme.spacing(1),
    marginLeft: "auto",
    alignSelf: "center",
  },
  descriptionBox: {
    margin: theme.spacing(2),
  },
  headerLeftContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(1),
    marginLeft: "auto",
    marginRight: "auto",
  },
  headerLeftButtonContainer: {},
  headerLeftButton: {
    textTransform: "none",
    margin: theme.spacing(1),
  },
  expandMore: {
    display: "flex",
    flexDirection: "row",
  },
  expandMoreInner: {
    display: "flex",
    width: "100%",
  },
  expandMoreFollow: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
  },
  listItem: {
    width: "50%",
    "& .MuiListItemText-primary": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  margin: theme.spacing(1),
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ProfilePage = ({ userProfileId }) => {
  const classes = useStyles();
  const {
    data,
    getUserData,
    getUserProfile,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    hasMore,
    userId,
    setSortBy,
  } = useSQL();
  const { user } = useAuth0();
  const [expanded, setExpanded] = useState(true);
  const [profile, setProfile] = useState({ name: "", avatar_url: "" });

  useEffect(() => {
    getUserProfile({ user_id: userProfileId })
      .then((res) => {
        console.log("profile", res);
        if (res && res.length > 0) {
          setProfile({
            name: res[0].user_name,
            avatar_url: res[0].user_avatar,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={classes.headerContainer}>
          <div className={classes.avatar}>
            <Avatar
              alt={profile.name}
              src={profile.avatar_url}
              style={{ height: "15vw", width: "15vw" }}
            />
          </div>
          <div className={classes.headerLeftContainer}>
            <div className={classes.summary}>
              <SummaryBox data={480} unit={"Posts"} />
              <SummaryBox data={480} unit={"Followers"} />
              <SummaryBox data={480} unit={"Following"} />
            </div>
            <div className={classes.headerLeftButtonContainer}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.headerLeftButton}
              >
                Follow
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.headerLeftButton}
              >
                Message
              </Button>
            </div>
          </div>
        </div>
        <div className={classes.descriptionBox}>
          <Typography align="left">{profile.name}</Typography>
          <Typography align="left">
            Welcome to my page, just another guy who likes meme
          </Typography>
        </div>
      </Collapse>
      <div className={classes.expandMore}>
        {!expanded && (
          <div className={classes.expandMoreInner}>
            <ListItem className={classes.listItem}>
              <ListItemAvatar>
                <Avatar alt={profile.name} src={profile.avatar_url} />
              </ListItemAvatar>
              <ListItemText primary={profile.name} />
            </ListItem>
            <div className={classes.expandMoreFollow}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.headerLeftButton}
              >
                Follow
              </Button>
            </div>
            <div>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </div>
          </div>
        )}
        {expanded && (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </div>
    </Card>
  );
};
export default ProfilePage;

const SummaryBox = ({ data, unit }) => {
  const classes = useStyles();
  return (
    <div className={classes.summaryBoxRoot}>
      <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
        {data}
      </Typography>
      <Typography variant="subtitle2">{unit}</Typography>
    </div>
  );
};
