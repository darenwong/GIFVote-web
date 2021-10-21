import { createSlice } from "@reduxjs/toolkit";
import { errorActions } from "./errorSlice";

const initialUserState = {
  userId: "507",
};

const ENDPOINT = "https://gif-vote.herokuapp.com";
//const ENDPOINT = "http://localhost:8080";

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
  },
});

export const getUserData = (user) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-get-user/?user_email=${user.email}&user_name=${user.nickname}&user_avatar=${user.picture}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("getUserData Failed.");
      }
      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      if (results && results[0] && results[0].id) {
        dispatch(userActions.setUserId(String(results[0].id)));
        localStorage.setItem("userId", String(results[0].id));
        /*if (data.length != 0) {
          refreshDataset();
        }*/
      } else {
        //logout();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const getUserProfile = ({ user_id, followee_id }) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-get-profile/?user_id=${user_id}&followee_id=${followee_id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("getUserProfile Failed.");
      }
      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      return results;
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const getUserFollowers = ({ user_id, followee_id }) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-get-followers/?user_id=${user_id}&followee_id=${followee_id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("getUserFollowers Failed.");
      }
      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      return results;
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const getUserFollowing = ({ user_id, follower_id }) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-get-following/?user_id=${user_id}&follower_id=${follower_id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("getUserFollowing Failed.");
      }
      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      return results;
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const getUserNumPost = ({ user_id }) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-get-numpost/?user_id=${user_id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("getUserNumPost Failed.");
      }
      return response;
    };

    try {
      const res = await sendRequest();
      const results = await res.json();
      return results;
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const submitFollow = ({ follower_id, followee_id, is_following }) => {
  return async (dispatch) => {
    dispatch(errorActions.clearHttpError("submitFollow"));

    const sendRequest = async () => {
      const response = await fetch(
        `${ENDPOINT}/api-insert-follow/?follower_id=${follower_id}&followee_id=${followee_id}&is_following=${is_following}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("submitFollow error");
      }

      return response;
    };

    try {
      const res = await sendRequest();
    } catch (error) {
      dispatch(errorActions.activateHttpError("submitFollow"));
    }
  };
};
export const userActions = userSlice.actions;

export default userSlice;
