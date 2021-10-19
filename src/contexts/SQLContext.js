import React, { useContext, useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { errorActions } from "../store/errorSlice";
import { useDispatch } from "react-redux";

const SQLContext = React.createContext();
//const ENDPOINT = "https://gif-vote.herokuapp.com";
const ENDPOINT = "http://localhost:8080";
export function useSQL() {
  return useContext(SQLContext);
}

export function SQLProvider({ children }) {
  const [data, setData] = useState([]);
  const result = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState("507");
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
  const [sortBy, setSortBy] = useState("vote");
  const seen = useRef(new Set());

  const dispatch = useDispatch();

  useEffect(() => {
    if (data.length == 0) {
    }
  }, [data]);

  const getUserData = (user) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-get-user/?user_email=${user.email}&user_name=${user.nickname}&user_avatar=${user.picture}`,
        { method: "POST" }
      )
        .then((res) => {
          return res.json();
        })
        .then((results) => {
          if (results && results[0] && results[0].id) {
            setUserId(String(results[0].id));
            localStorage.setItem("userId", String(results[0].id));
            if (data.length != 0) {
              refreshDataset();
            }
          } else {
            logout();
          }
          resolve(results);
        })
        .catch(reject);
    });
  };

  const getUserProfile = ({ user_id, followee_id }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-get-profile/?user_id=${user_id}&followee_id=${followee_id}`,
        {
          method: "GET",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((results) => {
          resolve(results);
        })
        .catch(reject);
    });
  };

  const getUserFollowers = ({ user_id, followee_id }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-get-followers/?user_id=${user_id}&followee_id=${followee_id}`,
        {
          method: "GET",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((results) => {
          resolve(results);
        })
        .catch(reject);
    });
  };

  const getUserFollowing = ({ user_id, follower_id }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-get-following/?user_id=${user_id}&follower_id=${follower_id}`,
        {
          method: "GET",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((results) => {
          resolve(results);
        })
        .catch(reject);
    });
  };

  const getUserNumPost = ({ user_id }) => {
    return new Promise((resolve, reject) => {
      fetch(`${ENDPOINT}/api-get-numpost/?user_id=${user_id}`, {
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((results) => {
          resolve(results);
        })
        .catch(reject);
    });
  };

  const getDataset = ({ isPersonal, isFollowing }) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("getDataset"));
      fetch(
        `${ENDPOINT}/api-vote/?user_id=${userId}&result=${data.length}&isPersonal=${isPersonal.state}&sortBy=${sortBy}&createdBy=${isPersonal.createdBy}&isFollowing=${isFollowing}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("getDataset error");
          }
          return res.json();
        })
        .then((results) => {
          let temp = {};
          for (let i = 0; i < results.length; i++) {
            let {
              poll_id,
              poll_text,
              gifurl: gifURL,
              gifimage,
              gifheight: gifHeight,
              gifwidth: gifWidth,
              option_id,
              option_name,
              votecount: voteCount,
              totalvotecount: totalVoteCount,
              created_by,
              user_id,
              user_avatar,
              created_at,
              isvoted_bool: isVoted_bool,
              isvoted_option_id: isVoted_option_id,
              comment_count,
              num_likes,
              user_liked,
            } = results[i];
            if (seen.current.has(poll_id)) {
              continue;
            }

            if (!(poll_id in temp)) {
              temp[poll_id] = {
                poll_text,
                poll_id,
                gifURL,
                gifimage,
                gifHeight,
                gifWidth,
                totalVoteCount,
                created_by,
                user_id,
                user_avatar,
                created_at,
                options: [],
                isVoted_bool,
                isVoted_option_id,
                comment_count,
                num_likes,
                user_liked,
                chartData: {
                  labels: [],
                  datasets: [
                    {
                      barThickness: 10,
                      maxBarThickness: 10,
                      label: "# of Votes",
                      data: [],
                      backgroundColor: [],
                    },
                  ],
                },
                voteData: [],
              };
            }

            temp[poll_id].options.push({ option_id, option_name, voteCount });

            temp[poll_id].voteData.push({
              option_id: option_id,
              text: option_name,
              votes: Number(voteCount),
              backgroundColor:
                isVoted_option_id == option_id
                  ? "rgba(34, 191, 160, 1)"
                  : "rgba(10, 10, 10, 0.5)",
            });
          }

          let poll_keys = Object.keys(temp);
          for (let i = 0; i < poll_keys.length; i++) {
            let poll_id = poll_keys[i];
            seen.current.add(poll_id);
            temp[poll_id].voteData.sort((a, b) => b.votes - a.votes);
            temp[poll_id].voteData.map(({ text, votes, backgroundColor }) => {
              temp[poll_id].chartData.labels.push(text);
              temp[poll_id].chartData.datasets[0].data.push(votes);
              temp[poll_id].chartData.datasets[0].backgroundColor.push(
                backgroundColor
              );
            });
          }

          let arr = Object.values(temp);

          switch (sortBy) {
            case "vote":
              arr.sort((a, b) => b.totalVoteCount - a.totalVoteCount);
              break;
            case "time":
              arr.sort((a, b) => b.poll_id - a.poll_id);
              break;
            case "like":
              arr.sort((a, b) => b.num_likes - a.num_likes);
          }
          setData((prevData) => {
            return [...prevData, ...arr];
          });
          if (arr.length == 0) {
            setHasMore(false);
          }

          resolve(data);
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("getDataset"));
          reject(error);
        });
    });
  };

  const refreshDataset = () => {
    result.current = 0;
    setHasMore(true);
    setData([]);
  };

  const updateDataset = (pollId) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("updateDataset"));
      fetch(`${ENDPOINT}/api-vote-update/?user_id=${userId}&poll_id=${pollId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("updateDataset error");
          }
          return res.json();
        })
        .then((results) => {
          let temp = {};
          for (let i = 0; i < results.length; i++) {
            let {
              poll_id,
              poll_text,
              gifurl: gifURL,
              gifimage,
              gifheight: gifHeight,
              gifwidth: gifWidth,
              option_id,
              option_name,
              votecount: voteCount,
              totalvotecount: totalVoteCount,
              created_by,
              user_id,
              user_avatar,
              created_at,
              isvoted_bool: isVoted_bool,
              isvoted_option_id: isVoted_option_id,
              comment_count,
              num_likes,
              user_liked,
            } = results[i];
            if (!(poll_id in temp)) {
              temp[poll_id] = {
                poll_text,
                poll_id,
                gifURL,
                gifimage,
                gifHeight,
                gifWidth,
                totalVoteCount,
                created_by,
                user_id,
                user_avatar,
                created_at,
                options: [],
                isVoted_bool,
                isVoted_option_id,
                comment_count,
                num_likes,
                user_liked,
                chartData: {
                  labels: [],
                  datasets: [
                    {
                      barThickness: 10,
                      maxBarThickness: 10,
                      label: "# of Votes",
                      data: [],
                      backgroundColor: [],
                    },
                  ],
                },
                voteData: [],
              };
            }
            temp[poll_id].options.push({ option_id, option_name, voteCount });

            temp[poll_id].voteData.push({
              option_id: option_id,
              text: option_name,
              votes: Number(voteCount),
              backgroundColor:
                isVoted_option_id == option_id
                  ? "rgba(34, 191, 160, 1)"
                  : "rgba(10, 10, 10, 0.5)",
            });
          }
          let poll_keys = Object.keys(temp);
          for (let i = 0; i < poll_keys.length; i++) {
            let poll_id = poll_keys[i];
            temp[poll_id].voteData.sort((a, b) => b.votes - a.votes);
            temp[poll_id].voteData.map(({ text, votes, backgroundColor }) => {
              temp[poll_id].chartData.labels.push(text);
              temp[poll_id].chartData.datasets[0].data.push(votes);
              temp[poll_id].chartData.datasets[0].backgroundColor.push(
                backgroundColor
              );
            });
          }

          setData((prevData) => {
            let data_copy = JSON.parse(JSON.stringify(prevData));
            for (let i = 0; i < data_copy.length; i++) {
              if (data_copy[i].poll_id == pollId) {
                data_copy[i] = JSON.parse(JSON.stringify(temp[pollId]));
                break;
              }
            }
            console.log(results);
            return data_copy;
          });
          resolve("OK");
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("updateDataset"));
        });
    });
  };

  const handleFetchMoreData = () => {
    if (data.length < result.current) {
      return;
    }
    result.current += 10;
    getDataset();
    console.log("fetchMoreData");
  };

  const handleFetchMoreDataPromise = ({ isPersonal, isFollowing }) => {
    return new Promise((resolve, reject) => {
      if (data.length < result.current) {
        reject("cancel fetch more data");
      }
      result.current += 10;
      getDataset({ isPersonal, isFollowing })
        .then(() => {
          resolve("OK");
        })
        .catch(() => {
          result.current -= 10;
          console.log("fetch data failed");
          reject("fetch data failed");
        });
    });
  };

  const submitFollow = ({ follower_id, followee_id }) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("submitFollow"));
      fetch(
        `${ENDPOINT}/api-insert-follow/?follower_id=${follower_id}&followee_id=${followee_id}`,
        { method: "POST" }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("submitFollow error");
          }
          return res.json();
        })
        .then((results) => {
          resolve("OK");
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("submitFollow"));
        });
    });
  };

  const submitVote = ({ user_id, poll_id, option_id }) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("submitVote"));
      fetch(
        `${ENDPOINT}/api-update/?user_id=${user_id}&poll_id=${poll_id}&option_id=${option_id}`,
        { method: "POST" }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("submitVote error");
          }
          return res.json();
        })
        .then((results) => {
          updateDataset(poll_id);
          resolve("OK");
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("submitVote"));
        });
    });
  };

  const getComments = (poll_id) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("getComments"));
      fetch(`${ENDPOINT}/api-comments/?poll_id=${poll_id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("getComments error");
          }
          return res.json();
        })
        .then((results) => {
          resolve(results);
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("getComments"));
          reject("getComments");
        });
    });
  };

  const submitComment = ({ user_id, poll_id, comment }) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("submitComment"));
      fetch(
        `${ENDPOINT}/api-insert-comments/?poll_id=${poll_id}&user_id=${user_id}&comment_text=${comment}`,
        {
          method: "POST",
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("submitComment error");
          }
          return res.json();
        })
        .then(async (results) => {
          updateDataset(poll_id);
          resolve("OK");
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("submitComment"));
        });
    });
  };

  const submitLike = ({ poll_id, user_id }) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("submitLike"));
      fetch(
        `${ENDPOINT}/api-insert-like/?poll_id=${poll_id}&user_id=${user_id}`,
        {
          method: "POST",
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("submitLike error");
          }
          return res.json();
        })
        .then((results) => {
          updateDataset(poll_id);
          resolve("OK");
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("submitLike"));
        });
    });
  };

  const submitPoll = ({ user_id, question, options }) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("submitPoll"));
      fetch(
        `${ENDPOINT}/api-new-poll/?user_id=${user_id}&question=${question}&options=${options}`,
        {
          method: "POST",
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("submitPoll error");
          }
          return res.json();
        })
        .then((results) => {
          resolve("OK");
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("submitPoll"));
        });
    });
  };

  const submitDeletePoll = ({ poll_id }) => {
    return new Promise((resolve, reject) => {
      dispatch(errorActions.clearHttpError("submitDeletePoll"));
      fetch(`${ENDPOINT}/api-delete-poll/?poll_id=${poll_id}`, {
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("submitDeletePoll error");
          }
          return res.json();
        })
        .then((results) => {
          resolve("OK");
        })
        .catch((error) => {
          dispatch(errorActions.activateHttpError("submitDeletePoll"));
        });
    });
  };

  return (
    <SQLContext.Provider
      value={{
        data,
        getUserData,
        getUserProfile,
        getUserFollowers,
        getUserFollowing,
        getUserNumPost,
        getDataset,
        updateDataset,
        refreshDataset,
        handleFetchMoreData,
        handleFetchMoreDataPromise,
        hasMore,
        userId,
        setUserId,
        setSortBy,
        submitVote,
        getComments,
        submitComment,
        submitLike,
        submitPoll,
        submitDeletePoll,
        submitFollow,
      }}
    >
      {children}
    </SQLContext.Provider>
  );
}
