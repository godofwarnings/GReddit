import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PublicRoutes from "./pages/PublicRoutes";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import ProfilePage from "./pages/ProfilePage";
import LoginRegPage from "./pages/LoginRegPage";
import SubredditPage from "./pages/SubredditPage";
import Navbar from "./components/Tabs/Navbar";
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect, useState } from "react";
import MySubredditSingleDetail from "./pages/MySubredditSingleDetail";
import NotFoundPage from "./pages/NotFoundPage";
import AllSubreddits from "./pages/AllSubreddits";
import PostSubredditPage from "./pages/PostSubredditPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import { SubredditContext } from "./context/SubredditContext";

function App() {
   const { initUser } = useContext(AuthContext);
   const { subreddit } = useContext(SubredditContext);
   const [userStatus, setUserStatus] = useState(false);
   useEffect(() => {
      initUser().then((status) => {
         console.log("Init user", status);
         setUserStatus(status);
      });
   }, []);
   return (
      <div className="flex flex-col">
         <Navbar/>
         <Routes>
            <Route
               exact
               path="/login"
               element={<LoginRegPage/>}
            />
            <Route
               exact
               path="/profile"
               element={<ProfilePage/>}
            >
            </Route>
            <Route path="/u/g/:name" element={<MySubredditSingleDetail/>}/>
            <Route path="g/:name" element={<SubredditPage/>}>
               <Route
                  index
                  element={
                     subreddit !== null && (
                        <PostSubredditPage posts={subreddit.posts}/>
                     )
                  }
               />
               <Route path="post/:id" element={<PostDetailsPage/>}/>
               <Route path="*" element={<NotFoundPage/>}/>
            </Route>

            <Route
               path="subreddits/all"
               element={userStatus ? <AllSubreddits/> : <Navigate to="/login"/>}
            />

            <Route path="*" element={<NotFoundPage/>}/>
         </Routes>
      </div>
   );
}

export default App;
