import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  userId: "507",
};

//const ENDPOINT = "https://gif-vote.herokuapp.com";
const ENDPOINT = "http://localhost:8080";

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

export const getUserFollowers = ({ user_id, followee_id }) => {
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

export const getUserFollowing = ({ user_id, follower_id }) => {
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

export const getUserNumPost = ({ user_id }) => {
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

export const userActions = userSlice.actions;

export default userSlice;
