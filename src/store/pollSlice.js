import { createSlice } from "@reduxjs/toolkit";
import { errorActions } from "./errorSlice";

const initialUserState = {
  data: [],
  hasMore: true,
  sortBy: "vote",
  result: 0,
};

const ENDPOINT = "https://gif-vote.herokuapp.com";
//const ENDPOINT = "http://localhost:8080";

const pollSlice = createSlice({
  name: "poll",
  initialState: initialUserState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    addData(state, action) {
      const results = action.payload;
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

      let arr = Object.values(temp);

      switch (state.sortBy) {
        case "vote":
          arr.sort((a, b) => b.totalVoteCount - a.totalVoteCount);
          break;
        case "time":
          arr.sort((a, b) => b.poll_id - a.poll_id);
          break;
        case "like":
          arr.sort((a, b) => b.num_likes - a.num_likes);
      }

      state.data = [...state.data, ...arr];
      state.result = state.data.length;
      if (arr.length == 0) {
        state.hasMore = false;
      }
    },
    refreshDataset(state) {
      state.hasMore = true;
      state.data = [];
      state.result = 0;
    },
    updateData(state, action) {
      let results = action.payload.results;
      let pollId = action.payload.pollId;
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

      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].poll_id == pollId) {
          state.data[i] = JSON.parse(JSON.stringify(temp[pollId]));
          break;
        }
      }
    },
    increaseResult(state, action) {
      state.result += action.payload;
    },
    decreaseResult(state, action) {
      state.result -= action.payload;
    },
    updateLike(state, action) {
      const pollId = action.payload.pollId;
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].poll_id == pollId) {
          if (state.data[i].user_liked == "1") {
            state.data[i].user_liked = "0";
            state.data[i].num_likes = String(
              Number(state.data[i].num_likes) - 1
            );
          } else {
            state.data[i].user_liked = "1";
            state.data[i].num_likes = String(
              Number(state.data[i].num_likes) + 1
            );
          }
          break;
        }
      }
    },
  },
});

export const getDataset = ({ isPersonal, isFollowing }) => {
  return async (dispatch, getState) => {
    dispatch(errorActions.clearHttpError("getDataset"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-vote/?user_id=${getState().user.userId}&result=${
          getState().poll.data.length
        }&isPersonal=${isPersonal.state}&sortBy=${
          getState().poll.sortBy
        }&createdBy=${isPersonal.createdBy}&isFollowing=${isFollowing}`
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }

      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      dispatch(pollActions.addData(results));
    } catch (error) {
      dispatch(errorActions.activateHttpError("getDataset"));
    }
  };
};

export const updateDataset = (pollId) => {
  return async (dispatch, getState) => {
    dispatch(errorActions.clearHttpError("updateDataset"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-vote-update/?user_id=${
          getState().user.userId
        }&poll_id=${pollId}`
      );

      if (!response.ok) {
        throw new Error("updateDataset error");
      }

      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      dispatch(pollActions.updateData({ results, pollId }));
    } catch (error) {
      console.log("updateDataset error", error);
      dispatch(errorActions.activateHttpError("updateDataset"));
    }
  };
};

export const handleFetchMoreDataPromise = ({ isPersonal, isFollowing }) => {
  return async (dispatch, getState) => {
    if (getState().poll.data.length < getState().poll.result) {
      return;
    }
    dispatch(pollActions.increaseResult(10));
    try {
      dispatch(getDataset({ isPersonal, isFollowing }));
    } catch (error) {
      dispatch(pollActions.decreaseResult(10));
    }
  };
};

export const submitVote = ({ user_id, poll_id, option_id }) => {
  return async (dispatch) => {
    dispatch(errorActions.clearHttpError("submitVote"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-update/?user_id=${user_id}&poll_id=${poll_id}&option_id=${option_id}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("submitVote error");
      }

      return response;
    };

    try {
      await sendRequest();
      dispatch(updateDataset(poll_id));
    } catch (error) {
      dispatch(errorActions.activateHttpError("submitVote"));
    }
  };
};

export const getComments = (poll_id) => {
  return async (dispatch) => {
    dispatch(errorActions.clearHttpError("getComments"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-comments/?poll_id=${poll_id}`
      );

      if (!response.ok) {
        throw new Error("getComments error");
      }

      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      return results;
    } catch (error) {
      dispatch(errorActions.activateHttpError("getComments"));
    }
  };
};

export const submitComment = ({ user_id, poll_id, comment }) => {
  return async (dispatch) => {
    dispatch(errorActions.clearHttpError("submitComment"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-insert-comments/?poll_id=${poll_id}&user_id=${user_id}&comment_text=${comment}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("submitComment error");
      }

      return response;
    };

    try {
      await sendRequest();
      dispatch(updateDataset(poll_id));
      return "OK";
    } catch (error) {
      dispatch(errorActions.activateHttpError("submitComment"));
    }
  };
};

export const submitLike = ({ poll_id, user_id, user_liked }) => {
  return async (dispatch) => {
    dispatch(errorActions.clearHttpError("submitLike"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-insert-like/?poll_id=${poll_id}&user_id=${user_id}&user_liked=${user_liked}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("submitLike error");
      }

      return response;
    };

    try {
      await sendRequest();
      dispatch(updateDataset(poll_id));
    } catch (error) {
      console.log("submitLike error", error);
      dispatch(errorActions.activateHttpError("submitLike"));
    }
  };
};

export const submitPoll = ({ user_id, question, options }) => {
  return async (dispatch) => {
    dispatch(errorActions.clearHttpError("submitPoll"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-new-poll/?user_id=${user_id}&question=${question}&options=${options}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("submitPoll error");
      }

      return response;
    };

    try {
      await sendRequest();
      return "OK";
    } catch (error) {
      dispatch(errorActions.activateHttpError("submitPoll"));
    }
  };
};

export const submitDeletePoll = ({ poll_id }) => {
  return async (dispatch) => {
    dispatch(errorActions.clearHttpError("submitDeletePoll"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-delete-poll/?poll_id=${poll_id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("submitDeletePoll error");
      }

      return response;
    };

    try {
      await sendRequest();
    } catch (error) {
      dispatch(errorActions.activateHttpError("updateDataset"));
    }
  };
};

export const pollActions = pollSlice.actions;

export default pollSlice;
