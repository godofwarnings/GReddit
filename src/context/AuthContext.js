import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthReducer } from "../reducer/AuthReducer";
import { PostReducer } from "../reducer/PostReducer";

const InitialStateUser = {
   user: {
      user: null,
      isLoading: true,
      error: "No user",
   },
};

const InitialStatePost = {
   post: {
      posts_upvoted: [],
      posts_downvoted: [],
      posts_user: null,
      posts_saved: null,
      posts_subreddit: null,
      isLoading: false,
      error: null,
   },
};
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   const [user, dispatchUser] = useReducer(AuthReducer, InitialStateUser);
   const [post, dispatchPost] = useReducer(PostReducer, InitialStatePost);
   const navigate = useNavigate();
   // useEffect(() =>
   //       initUser()
   //          .then((stat) => console.log(stat))
   //          .catch((err) => console.log(err)),
   //    []);

   //* SUBREDDIT
   const createSubreddit = async (name, description, tags, banned_keywords) => {
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      const body = JSON.stringify({ name, description, tags, banned_keywords });
      try {
         const response = await axios.post(
            `/api/subreddit/create`,
            body,
            config
         );
         const subreddit = response.data;
         await initUser("dont_redirect");
         console.log(subreddit)
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   }
   const removeSubreddit = async (name) => {
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.delete(`/api/subreddit/delete/g/${name}`, config)
         console.log(response.data)
         await initUser("dont_redirect");
      } catch (err) {
         if (err.response) {
            console.log("The err data", err.response.data.error);
            console.log(err.response.status);
            console.log(err.response.headers);
            dispatchUser({
               type: "LOGIN_FAILURE",
               payload: err.response.data.error,
            });
            // console.log("After dispatch", user.error);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   }
   //* USER
   const initUser = async (redirect) => {
      dispatchUser({ type: "LOGIN_INIT" });
      if (user.user.updatedUser) {
         dispatchUser({ type: "API_TERMINATE" });
         return true;
      }
      const user_ = JSON.parse(localStorage.getItem("user"));
      if (user_) {
         console.log(user_.token);
         const config = {
            headers: {
               Authorization: `Bearer ${user_.token}`,
            },
         };
         try {
            const response = await axios.get("/api/user/u", config);
            const fetchedUser = response.data;
            console.log("from fetch", fetchedUser);
            dispatchUser({
               type: "LOGIN_SUCCESS",
               payload: { updatedUser: fetchedUser, token: user_.token },
            });
            if (!redirect) {
               navigate("/profile");
            }
            return true;
         } catch (err) {
            if (err.response) {
               console.log("The err data", err.response.data.error);
               console.log(err.response.status);
               console.log(err.response.headers);
               dispatchUser({
                  type: "LOGIN_FAILURE",
                  payload: err.response.data.error,
               });
            } else if (err.request) {
               console.log(err.request);
            } else {
               console.log("Error", err.message);
            }
            return false;
         }
      } else {
         dispatchUser({ type: "API_TERMINATE" });
         return false;
      }
   };
   const login = async (emailID, password) => {
      dispatchUser({
         type: "LOGIN_INIT",
      });
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const body = JSON.stringify({ emailID, password });
      try {
         const response = await axios.post("/api/user/login", body, config);
         const user = response.data;
         console.log("The recieved response", response);
         // save the user,json token to local storage
         localStorage.setItem("user", JSON.stringify(user));
         // update current user
         dispatchUser({ type: "LOGIN_SUCCESS", payload: user });
         console.log("User logged in successfully");
         return true;
      } catch (err) {
         if (err.response) {
            console.log("The err data", err.response.data.error);
            console.log(err.response.status);
            console.log(err.response.headers);
            dispatchUser({
               type: "LOGIN_FAILURE",
               payload: err.response.data.error,
            });
            // console.log("After dispatch", user.error);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
         return false;
      }
   };
   const signup = async (fname, lname, username, age, emailID, password) => {
      dispatchUser({ type: "LOGIN" });
      const newUser = { fname, lname, username, age, emailID, password };
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const body = JSON.stringify(newUser);
      try {
         const response = await axios.post("/api/user/signup", body, config);
         console.log("The recieved response", response);
         const user = response.data;
         localStorage.setItem("user", JSON.stringify(user));
         dispatchUser({ type: "LOGIN_SUCCESS", payload: user });
         console.log("User registered successfully");
         return true
      } catch (err) {
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            dispatchUser({
               type: "LOGIN_FAILURE",
               payload: err.response.date,
            });
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const logout = async () => {
      localStorage.removeItem("user");
      dispatchUser({ type: "LOGOUT" });
   };
   const removeFollower = async (id) => {
      const body = JSON.stringify({
         remove_id: id,
      });
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(
            `/api/user/remove_follower/${id}`,
            config
         );
         console.log(response.data);
         dispatchUser({
            type: "UPDATE_USER",
            payload: response.data.updatedUser,
         });
         console.log("After dispatch", user.user.user.updatedUser);
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const removeFollowing = async (id) => {
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(
            `/api/user/remove_following/${id}`,
            config
         );
         console.log(response.data);
         dispatchUser({
            type: "UPDATE_USER",
            payload: response.data.updatedUser,
         });
         console.log("After dispatch", user.user.user.updatedUser);
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const followUser = async (id) => {
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(`/api/user/follow/${id}`, config);
         console.log(response.data);
         dispatchUser({
            type: "UPDATE_USER",
            payload: response.data.updatedUser,
         });
         console.log("FOLLOW STATUS", response.data.status);
         return response.data.status;
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const requestAction = async (action, id, name) => {
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(
            `/api/subreddit/g/request/${name}/${id}/${action}`,
            config
         );
         const data = response.data;
         console.log("Handled request", data);
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   //* POST

   // TODO: - Join Subreddit
   //       - Leave Subreddit

   const initPosts = async () => {
      dispatchPost({
         type: "API_CALL_INIT",
      });
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      axios
         .all([
            axios.get(
               `/api/post/author/${user.user.user.updatedUser.emailID}`,
               config
            ),
            axios.get(`/api/post/saved`, config),
         ])
         .then((res) => {
            dispatchPost({ type: "AUTHOR_POSTS", payload: res[0].data.posts });
            dispatchPost({ type: "SAVED_POSTS", payload: res[1].data.saved_posts });
         })
         .catch((err) => {
            console.log("ERROR");
            if (err.response) {
               console.log(err.response.data);
               console.log(err.response.status);
               console.log(err.response.headers);
               dispatchPost({ type: "API_CALL_FAILURE" });
            } else if (err.request) {
               console.log(err.request);
            } else {
               console.log("Error", err.message);
            }
         });
   };
   const savePost = async (post_) => {
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(`/api/post/save/${post_._id}`, config);
         const saved = response.data;
         if (saved.saved) {
            if (!post.post.posts_saved) {
               dispatchPost({
                  type: "SAVED_POST_ADD_NULL",
                  payload: post_,
               });
            } else {
               dispatchPost({ type: "SAVED_POSTS_ADD", payload: post_ });
            }
         } else {
            dispatchPost({ type: "SAVED_POSTS_REMOVE", payload: post_._id });
         }
         console.log("Saved or not", saved);
         return saved;
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            // The client was given an error response (5xx, 4xx)
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            // The client never received a response, and the request was never left
            console.log(err.request);
         } else {
            // Anything else
            console.log("Error", err.message);
         }
      }
   };
   const upvotePost = async (id) => {
      dispatchPost({
         type: "API_CALL_INIT",
      });
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(`/api/post/upvote/${id}`, config);
         const upvote = response.data;
         console.log("upvote", upvote);
         dispatchPost({ type: "API_CALL_SUCCESS" });
         return upvote;
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            dispatchPost({
               type: "API_CALL_FAILURE",
            });
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const downvotePost = async (id) => {
      dispatchPost({
         type: "API_CALL_INIT",
      });
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(`/api/post/downvote/${id}`, config);
         const downvote = response.data;
         console.log("downvote", downvote);
         dispatchPost({ type: "API_CALL_SUCCESS" });
         return downvote;
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            dispatchPost({
               type: "API_CALL_FAILURE",
            });
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const deletePost = async (id, saved) => {
      dispatchPost({
         type: "API_CALL_INIT",
      });
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.delete(`/api/post/delete/${id}`, config);
         const data = response.data;
         console.log(data);
         dispatchPost({ type: "AUTHOR_POSTS_REMOVE", payload: id });
         if (saved) {
            dispatchPost({
               type: "SAVED_POSTS_REMOVE",
               payload: id,
            });
         }
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            // The client was given an error response (5xx, 4xx)
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            // The client never received a response, and the request was never left
            console.log(err.request);
         } else {
            // Anything else
            console.log("Error", err.message);
         }
      }
   };
   const createPost = async (title, text, subreddit) => {
      dispatchPost({ type: "API_CALL_INIT" });
      const newPost = { title, text, subreddit };
      const body = JSON.stringify(newPost);
      console.log(body);
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.post("/api/post/create", body, config);
         const post = response.data;
         console.log("From Authcontext", post.post);
         if (!post.post.posts_user) {
            dispatchPost({ type: "AUTHOR_POSTS_ADD_NULL", payload: post.post });
         } else {
            dispatchPost({ type: "AUTHOR_POSTS_ADD", payload: post.post });
         }
         return post.post;
      } catch (err) {
         console.log("ERROR");
         dispatchPost({ type: "API_CALL_FAILURE", payload: err });
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const addComment = async (text, id) => {
      const newComment = { text };
      const body = JSON.stringify(newComment);
      console.log(body);
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.post(
            `/api/post/comment/${id}`,
            body,
            config
         );
      } catch (err) {
         console.log("ERROR");
         dispatchPost({ type: "API_CALL_FAILURE", payload: err });
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };

   //* REPORTS
   const createReport = async (id, concern) => {
      const config = {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      const body = JSON.stringify({ concern });
      try {
         const response = await axios.post(
            `/api/report/create/${id}`,
            body,
            config
         );
         const report = response.data;
         await initUser("dont_redirect");
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const deletePostReport = async (report_id) => {
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.delete(
            `/api/report/delete/${report_id}`,
            config
         );
         await initUser("redirect_please");
      } catch (err) {
         console.log("ERROR");
         dispatchPost({ type: "API_CALL_FAILURE", payload: err });
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const blockPostReport = async (report_id) => {
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(
            `/api/report/block_user/${report_id}`,
            config
         );
         await initUser("redirect_please");
      } catch (err) {
         console.log("ERROR");
         dispatchPost({ type: "API_CALL_FAILURE", payload: err });
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   };
   const ignoreReport = async (report_id) => {
      const config = {
         headers: {
            Authorization: `Bearer ${user.user.user.token}`,
         },
      };
      try {
         const response = await axios.get(
            `/api/report/ignore/${report_id}`,
            config
         );
         await initUser("redirect_please");
      } catch (err) {
         console.log("ERROR");
         dispatchPost({ type: "API_CALL_FAILURE", payload: err });
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   }
   return (
      <AuthContext.Provider
         value={{
            ...user,
            ...post,
            dispatchUser,
            dispatchPost,
            followUser,
            login,
            initUser,
            signup,
            logout,
            removeFollower,
            removeFollowing,
            initPosts,
            savePost,
            upvotePost,
            downvotePost,
            deletePost,
            createPost,
            requestAction,
            addComment,
            createReport,
            deletePostReport,
            blockPostReport,
            ignoreReport,
            createSubreddit,
            removeSubreddit
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export default AuthProvider;
