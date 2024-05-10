import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {
   Navigate,
   Outlet,
   Route,
   Routes,
   useNavigate,
   useParams,
} from "react-router-dom";

import bgImage1 from "../images/bg-1.jpg";
import bgImage2 from "../images/bg-2.jpg";
import bgImage3 from "../images/bg-3.jpg";

import { SubredditContext } from "../context/SubredditContext";
import PostSingle from "../components/PostSingle";
import { IoCreateOutline } from "react-icons/io5";
import PostSubredditPage from "./PostSubredditPage";
import PostDetailsPage from "./PostDetailsPage";
import { AuthContext } from "../context/AuthContext";
import ModalPost from "../components/ModalPost";
import Loading from "./Loading";

const SubredditPage = ({ userStatus }) => {
   const navigate = useNavigate();
   const { name } = useParams();
   const { user } = useContext(AuthContext);
   const { subreddit, isLoading, error, fetchSubreddit } =
      useContext(SubredditContext);
   const backgroundImageStyle = {
      backgroundImage: `url("${bgImage1}")`,
   };
   const backgroundImageStyle2 = {
      backgroundImage: `url("${bgImage3}")`,
   };
   const subImage = {
      backgroundImage: `url("${bgImage2}")`,
   };
   const [viewModal, setViewModal] = useState(false);
   const [isMember, setIsMember] = useState(false);
   useEffect(() => {
      if (!user.isLoading) {
         if (!user.user) {
            console.log("User", user.user);
            navigate("/login");
         } else {
            console.log("inside fetching useEffect");
            fetchSubreddit(name);
         }
      }
   }, []);
   const date_options = {
      year: "numeric",
      month: "long",
      day: "numeric"
   };
   useEffect(() => {
      if (subreddit && user.user) {
         console.log("2nd Useeffect", subreddit);
         if (subreddit.creator === user.user.updatedUser._id) {
            console.log("moderator");
            setIsMember("moderator");
         } else if (subreddit.left_users) {
            if (subreddit.left_users.includes(user.user.updatedUser._id)) {
               console.log("left");
               setIsMember("left");
            }
         } else if (subreddit.blocked_users) {
            if (subreddit.blocked_users.includes(user.user.updatedUser._id)) {
               console.log("blocked");
               setIsMember("blocked");
            }
         } else if (subreddit.followers) {
            if (subreddit.followers.includes(user.user.updatedUser._id)) {
               console.log("member");
               setIsMember("member");
            }
         } else {
            console.log("not_member");
            setIsMember("not_member");
         }
      }
   }, [subreddit]);

   return (
      (isLoading || !subreddit ? (<Loading/>) : (<div className="flex flex-col justify-center bg-base-100 text-primary-content">
         {/* Subreddit Image */}
         <div
            style={subImage}
            className="flex h-[400px] items-center justify-center bg-center"
         ></div>
         {/* Subreddit basic info */}
         <div className="flex flex-row justify-start space-x-10 m-5 bg-primary p-5 rounded-md">
            <div className="rounded-full">
               <img
                  className="h-[80px]"
                  src="https://communitiesdelegation.org/wp-content/uploads/2020/11/community-icon.png"
                  alt="Image will go here"
               />
            </div>
            <div className="flex flex-col items-center">
               <div>
                  <h1 className="text-5xl font-bold">
                     Welcome to {isLoading ? (
                     <p>Loading...</p>
                  ) : error ? (
                     <p>{error}</p>
                  ) : (
                     subreddit.name
                  )}
                  </h1>
               </div>
               <div>
                  g/
                  {isLoading ? (
                     <p>Loading...</p>
                  ) : error ? (
                     <p>{error}</p>
                  ) : (
                     subreddit.name
                  )}
               </div>
            </div>
            <div className="flex items-center">
               {isMember === "member" ? (
                  <button
                     className="bg-base-100 rounded-md text-primary hover:bg-white hover:text-base-100 w-[100px] h-[40px]">
                     Leave
                  </button>
               ) : isMember === "moderator" ? (
                  <button
                     disabled
                     className="bg-base-100 rounded-md text-primary w-[100px] h-[40px]"
                  >
                     Moderator
                  </button>
               ) : (
                  <button
                     className="bg-white rounded-md text-base-100 hover:bg-base-100 hover:text-primary w-[100px] h-[40px]">
                     Join
                  </button>
               )}
            </div>
         </div>
         7{/* Posts , About, Banned keywords, tags */}
         <div className="flex flex-row space-x-10">
            {/* Post and Create Post div flex-col*/}
            <div className="flex grow flex-col space-y-4 justify-start h-full py-10 px-10">
               {/* Create Post */}
               <div
                  className="flex grow flex-col justify-start h-min-[100px] py-10 px-10 mx-[100px] bg-base-content rounded-md">
                  <div className="flex flex-row space-x-3">
                     <label className="text-4xl">
                        Create a new post
                        <ModalPost
                           subredditName={subreddit.name}
                           isVisible={viewModal}
                           onClose={() => setViewModal(false)}
                        />
                     </label>
                     <button onClick={() => setViewModal(true)}>
                        <IoCreateOutline size={35}/>
                     </button>
                  </div>
               </div>
               {/* Post div */}
               <div
                  className="flex grow flex-col justify-start h-full py-10 px-10 m-[100px] bg-base-content rounded-md">
                  <Outlet/>
               </div>
            </div>
            {/* About, Banned keywords, tags */}
            <div className="flex flex-col space-y-10 py-7 px-7">
               {/* About */}
               <div className="flex flex-col rounded-md bg-primary w-[400px]">
                  <div>
                     <h1 className="text-3xl text-secondary-content font-bold p-2 bg-secondary">
                        About Community
                     </h1>
                  </div>
                  <div className="py-3 px-2">
                     {isLoading ? (
                        <p>Loading...</p>
                     ) : error ? (
                        <p>{error}</p>
                     ) : (
                        subreddit.description
                     )}
                  </div>
                  <div>Created on {new Date(subreddit.createdAt).toLocaleDateString("en-US", date_options)}</div>
                  <div className="flex flex-row justify-around p-2 m-2">
                     <div>{isLoading ? (
                        <p>Loading...</p>
                     ) : error ? (
                        <p>{error}</p>
                     ) : (
                        subreddit.followers_number
                     )} Members
                     </div>
                     <div>{isLoading ? (
                        <p>Loading...</p>
                     ) : error ? (
                        <p>{error}</p>
                     ) : (
                        subreddit.posts && subreddit.posts.length
                     )} Posts
                     </div>
                  </div>
               </div>

               {/* Tags */}
               <div className="flex flex-col rounded-md bg-primary">
                  <div>
                     <h1 className="text-3xl font-bold p-2 bg-secondary">Tags</h1>
                  </div>
                  <div className="py-3 px-2">
                     {subreddit.tags && subreddit.tags.length}
                     <div className="badge badge-success gap-2">success</div>
                     {" "}
                  </div>
               </div>

               {/* Banned Keywords */}
               <div className="flex flex-col rounded bg-primary">
                  <div>
                     <h1 className="text-3xl font-bold p-2 bg-secondary">
                        Banned Keywords
                     </h1>
                  </div>
                  <div className="py-3 px-2"> Banned keywords</div>
               </div>
            </div>
         </div>
      </div>))
   );
};

export default SubredditPage;
