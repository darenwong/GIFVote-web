import {
  Button,
  Card,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import { useEffect, useState, useRef } from "react";
import { useSQL } from "../../contexts/SQLContext.js";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useHistory } from "react-router-dom";
import SignInPage from "../../components/SignInPage.js";
import {    getUserProfile,
  getUserFollowers,
  getUserFollowing,
  getUserNumPost} from "../../store/userSlice"
import { useSelector } from "react-redux";

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
  link: {
    textDecoration: "none",
    "&:focus, &:hover, &:visited, &:link, &:active": {
      textDecoration: "none",
    },
    color: "black",
  },
}));


const ProfilePageList = ({ userProfileId }) => {
  const classes = useStyles();
  const {
    submitFollow,
  } = useSQL();
  const { user, isAuthenticated } = useAuth0();
  const [profile, setProfile] = useState({
    name: "",
    avatar_url: "",
    is_following: 0,
  });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [numPost, setNumPost] = useState(0);
  const [open, setOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const userId = useSelector(state => state.user.userId)


  useEffect(() => {
    refreshProfile();
  }, [userProfileId]);

  const refreshProfile = () => {
    getUserProfile({ user_id: userId, followee_id: userProfileId })
      .then((res) => {
        if (res && res.length > 0) {
          setProfile({
            name: res[0].user_name,
            avatar_url: res[0].user_avatar,
            is_following: res[0].is_following,
          });
        }
      })
      .catch(() => {});
    getUserFollowers({ user_id: userId, followee_id: userProfileId })
      .then((res) => {
        if (res && res.length > 0) {
          setFollowers(res);
        }
      })
      .catch(() => {});
    getUserFollowing({ user_id: userId, follower_id: userProfileId })
      .then((res) => {
        if (res && res.length > 0) {
          setFollowing(res);
        }
      })
      .catch(() => {});
    getUserNumPost({ user_id: userProfileId })
      .then((res) => {
        if (res && res.length > 0) {
          setNumPost(res[0].numpost);
        }
      })
      .catch(() => {});
  };


  const handleFollow = ({ follower_id, followee_id }) => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    submitFollow({ follower_id, followee_id })
      .then(() => {
        refreshProfile();
      })
      .catch(() => {});
  };

  const handleMessage = ({ from_id, to_id }) => {
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    setInboxOpen(true);
  };

  return (
    <Card className={classes.root}>
      <SignInPage
        signInMsg={"Sign in to follow/message"}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Dialog
        open={inboxOpen}
        onClose={() => {
          setInboxOpen(false);
        }}
      >
        <DialogTitle>Message feature coming soon!</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setInboxOpen(false);
            }}
            color="primary"
            style={{ textTransform: "none" }}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.headerContainer}>
        <div className={classes.avatar}>
          <Avatar
            alt={profile.name}
            src={profile.avatar_url}
            style={{
              height: "10vw",
              width: "10vw",
              maxHeight: "112px",
              maxWidth: "112px",
              minHeight: "50px",
              minWidth: "50px",
            }}
          />
        </div>
        <div className={classes.headerLeftContainer}>
          <div className={classes.summary}>
            <SummaryBox
              data={numPost}
              unit={"Posts"}
              userId={userId}
              handleFollow={handleFollow}
            />
            <SummaryBox
              data={followers}
              unit={"Followers"}
              userId={userId}
              handleFollow={handleFollow}
            />
            <SummaryBox
              data={following}
              unit={"Following"}
              userId={userId}
              handleFollow={handleFollow}
            />
          </div>
          {userId != userProfileId && (
            <div className={classes.headerLeftButtonContainer}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.headerLeftButton}
                onClick={() =>
                  handleFollow({
                    follower_id: userId,
                    followee_id: userProfileId,
                  })
                }
              >
                {profile.is_following == 0 ? "Follow" : "Following"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.headerLeftButton}
                onClick={() => {
                  handleMessage({
                    from_id: userId,
                    to_id: userProfileId,
                  });
                }}
              >
                Message
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={classes.descriptionBox}>
        <Typography align="left">{profile.name}</Typography>
      </div>
    </Card>
  );
};
export default ProfilePageList;

const SummaryBox = ({ data, unit, handleFollow, userId }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  let history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = ({ follower_id, followee_id }) => {
    handleClose();
  };

  return (
    <div>
      {unit != "Posts" && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{data.length + " " + unit}</DialogTitle>
          <Divider />
          <List sx={{ pt: 0 }}>
            {data.map(
              (
                {
                  user_avatar,
                  user_name,
                  follower_id,
                  followee_id,
                  user_is_following,
                },
                index
              ) => (
                <ListItem key={index}>
                  <ListItem
                    component={Link}
                    to={
                      unit == "Followers"
                        ? `/profile/${follower_id}`
                        : `/profile/${followee_id}`
                    }
                    onClick={() => {
                      handleClick({ follower_id, followee_id });
                    }}
                    className={classes.link}
                  >
                    <ListItemAvatar>
                      <Avatar alt={user_name} src={user_avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={user_name} />
                  </ListItem>
                  {follower_id != userId && followee_id != userId && (
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      className={classes.headerLeftButton}
                      onClick={() => {
                        unit == "Followers"
                          ? handleFollow({
                              follower_id: userId,
                              followee_id: follower_id,
                            })
                          : handleFollow({
                              follower_id: userId,
                              followee_id: followee_id,
                            });
                      }}
                    >
                      {user_is_following == 0 ? "Follow" : "Following"}
                    </Button>
                  )}
                </ListItem>
              )
            )}
          </List>
        </Dialog>
      )}
      <div
        className={classes.summaryBoxRoot}
        onClick={() => {
          if (unit != "Posts") setOpen(true);
        }}
      >
        <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
          {unit == "Posts" ? data : data.length}
        </Typography>
        <Typography variant="subtitle2">{unit}</Typography>
      </div>
    </div>
  );
};
