import { createContext, useReducer, useContext } from "react";
import { SubredditReducer } from "../reducer/SubredditReducer";
import axios from "axios";
import { AuthContext } from "./AuthContext";
//* The initial state
const InitialState = { subreddit: "does not exist", isLoading: false, error: null };

//* Create context
export const SubredditContext = createContext(InitialState);

//* The context provider
const SubredditProvider = ({ children }) => {
   const [state, dispatch] = useReducer(SubredditReducer, InitialState);
   const { user } = useContext(AuthContext)
   const fetchSubreddit = async (name) => {
      dispatch({
         type: 'GET_SUB'
      })
      try {
         const response = await axios.get(`/api/subreddit/g/${name}`);
         const subreddit = response.data;
         console.log(subreddit);
         dispatch(
            {
               type: "SET_SUB_SUCCESS",
               payload: subreddit,
            }
         )
      } catch (err) {
         console.log("ERROR");
         if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            dispatch({
               type: "SET_SUB_FAILURE",
               payload: err.response.data
            })
         } else if (err.request) {
            console.log(err.request);
         } else {
            console.log("Error", err.message);
         }
      }
   }
   return (
      <div>
         <SubredditContext.Provider
            value={{ ...state, dispatch, fetchSubreddit }}>{children}</SubredditContext.Provider>
      </div>
   );
};

export default SubredditProvider;
