import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
const SQLContext = React.createContext();
//const ENDPOINT = "https://gif-vote.herokuapp.com";
const ENDPOINT = "http://localhost:8080";
export function useSQL() {
  return useContext(SQLContext);
}

export function SQLProvider({ children }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInMsg, setSignInMsg] = useState("");
  const [data, setData] = useState([]);
  const result = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  //const  isPersonal = useRef({ state: 0, createdBy: "507" });
  const [userId, setUserId] = useState("507");
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
  const [sortBy, setSortBy] = useState("vote");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const seen = useRef(new Set());

  useEffect(() => {
    //console.log("change", JSON.parse(JSON.stringify(data)));
    if (data.length == 0) {
      //getDataset({ isPersonal: { state: 0, createdBy: 1 } });
    }
  }, [data]);
  /*
  useEffect(() => {
    console.log("isPersonal, sortBy setting changed");
    refreshDataset();
  }, [isPersonal, sortBy]);
*/
  useEffect(() => {
    console.log("data changed", data);
  }, [data]);

  const getUserData = (user) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-get-user/?user_email=${user.email}&user_name=${user.nickname}&user_avatar=${user.picture}`,
        { method: "POST" }
      )
        .then((res) => {
          //console.log(res);
          return res.json();
        })
        .then((results) => {
          console.log("userId = ", results);
          if (results && results[0] && results[0].id) {
            setUserId(String(results[0].id));
            refreshDataset();
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
          //console.log(res);
          return res.json();
        })
        .then((results) => {
          console.log("user profile = ", results);
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
          //console.log(res);
          return res.json();
        })
        .then((results) => {
          console.log("user follower = ", results);
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
          //console.log(res);
          return res.json();
        })
        .then((results) => {
          console.log("user following = ", results);
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
          //console.log(res);
          return res.json();
        })
        .then((results) => {
          console.log("user numpost = ", results);
          resolve(results);
        })
        .catch(reject);
    });
  };

  const getDataset = ({ isPersonal, isFollowing }) => {
    return new Promise((resolve, reject) => {
      console.log("getting dataset", data.length, isPersonal);
      /*
      if (data.length > result.current || !hasMore) {
        return;
      }*/

      //console.log("calling API", result.current);
      fetch(
        `${ENDPOINT}/api-vote/?user_id=${userId}&result=${data.length}&isPersonal=${isPersonal.state}&sortBy=${sortBy}&createdBy=${isPersonal.createdBy}&isFollowing=${isFollowing}`
      )
        .then((res) => res.json())
        .then((results) => {
          //console.log("success", results);
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
          //console.log("sortBy", sortBy);
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
          setData([...data, ...arr]);
          if (arr.length == 0) {
            setHasMore(false);
          }
          console.log("new data", arr);

          resolve(data);
        })
        .catch(() => {
          reject("get data failed");
        });
    });
  };

  const refreshDataset = () => {
    console.log("refreshing data");
    result.current = 0;
    setHasMore(true);
    setData([]);
  };

  const updateDataset = (pollId) => {
    return new Promise((resolve, reject) => {
      //console.log("calling Update API");
      //console.log("before before", JSON.parse(JSON.stringify(data)));
      fetch(`${ENDPOINT}/api-vote-update/?user_id=${userId}&poll_id=${pollId}`)
        .then((res) => res.json())
        .then((results) => {
          //console.log("success", results);
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

          let data_copy = JSON.parse(JSON.stringify(data));
          //console.log("before", JSON.parse(JSON.stringify(data)));
          for (let i = 0; i < data_copy.length; i++) {
            if (data_copy[i].poll_id == pollId) {
              data_copy[i] = JSON.parse(JSON.stringify(temp[pollId]));
              break;
            }
          }
          //console.log(data_copy);
          setData(JSON.parse(JSON.stringify(data_copy)));
          resolve(data_copy);
        })
        .catch(reject);
    });
  };

  const handleFetchMoreData = () => {
    console.log("fetching more data ", result, data.length);
    if (data.length < result.current) {
      //console.log("cancel fetch more data");
      return;
    }
    result.current += 10;
    getDataset();
  };

  const handleFetchMoreDataPromise = ({ isPersonal, isFollowing }) => {
    return new Promise((resolve, reject) => {
      if (data.length < result.current) {
        //console.log("cancel fetch more data");
        reject("cancel fetch more data");
      }
      result.current += 10;
      console.log("fetching more data prom", result, data.length);
      getDataset({ isPersonal, isFollowing })
        .then(() => {
          resolve("OK");
        })
        .catch(() => {
          result.current -= 10;
          reject("fetch data failed");
        });
    });
  };

  const submitFollow = ({ follower_id, followee_id }) => {
    return new Promise((resolve, reject) => {
      console.log("submitFollow", follower_id, followee_id);
      fetch(
        `${ENDPOINT}/api-insert-follow/?follower_id=${follower_id}&followee_id=${followee_id}`,
        { method: "POST" }
      )
        .then((res) => {
          console.log(res);
          res.json();
        })
        .then((results) => {
          console.log("follow", results);
          resolve("OK");
        })
        .catch(reject);
    });
  };

  const submitVote = ({ user_id, poll_id, option_id }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-update/?user_id=${user_id}&poll_id=${poll_id}&option_id=${option_id}`,
        { method: "POST" }
      )
        .then((res) => {
          //console.log(res);
          res.json();
        })
        .then((results) => {
          //console.log("update", results);
          updateDataset(poll_id);
          resolve("OK");
        })
        .catch(reject);
    });
  };

  const getComments = (poll_id) => {
    return new Promise((resolve, reject) => {
      fetch(`${ENDPOINT}/api-comments/?poll_id=${poll_id}`)
        .then((res) => res.json())
        .then((results) => {
          //console.log("comments", results);
          resolve(results);
        })
        .catch(reject);
    });
  };

  const submitComment = ({ user_id, poll_id, comment }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-insert-comments/?poll_id=${poll_id}&user_id=${user_id}&comment_text=${comment}`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then(async (results) => {
          //console.log("comment inserted", results);
          updateDataset(poll_id);
          resolve("OK");
        })
        .catch(reject);
    });
  };

  const submitLike = ({ poll_id, user_id }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-insert-like/?poll_id=${poll_id}&user_id=${user_id}`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((results) => {
          //console.log("like inserted", results, poll_id, user_id);
          updateDataset(poll_id);
          resolve("OK");
        })
        .catch(reject);
    });
  };

  const submitPoll = ({ user_id, question, options }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${ENDPOINT}/api-new-poll/?user_id=${user_id}&question=${question}&options=${options}`,
        {
          method: "POST",
        }
      )
        .then((res) => {
          //console.log("hello1", res);
          return res.json();
        })
        .then((results) => {
          //console.log("hello2", results);
          resolve("OK");
        })
        .catch(reject);
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
        setSortBy,
        submitVote,
        getComments,
        submitComment,
        submitLike,
        submitPoll,
        submitFollow,
      }}
    >
      {children}
    </SQLContext.Provider>
  );
}
