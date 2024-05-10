import { useContext, useEffect, useState } from "react";
import axios from "axios";

//* AntIcons
import { AiFillDislike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { AiTwotoneDelete } from "react-icons/ai";

//* Bootstrap icons
import { BsFillBookmarkCheckFill, BsFlag } from "react-icons/bs";
import { BsBookmarkPlus } from "react-icons/bs";

//* Feather and Font Awesome Icons
import { FiUserPlus } from "react-icons/fi";
import { FaUserTimes, FaRegCommentAlt, FaFlagUsa } from "react-icons/fa";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

//* Other Imports
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SubredditContext } from "../context/SubredditContext";
import ModalReport from "./ModalReport";
import Loading from "../pages/Loading";

const PostSingle = (props) => {
   const date_options = {
      year: "numeric",
      month: "long",
      day: "numeric",
   };
   const {
      user,
      savePost,
      post,
      upvotePost,
      downvotePost,
      deletePost,
      followUser,
   } = useContext(AuthContext);
   const { subreddit, dispatch, fetchSubreddit } = useContext(SubredditContext);
   const [viewModal, setViewModal] = useState(false);
   const [upvoted, setUpvoted] = useState(false);
   const [downvoted, setDownvoted] = useState(false);
   const [netUpvotes, setNetUpvotes] = useState(0);
   const [saved, setSaved] = useState(false);
   const [owner, setOwner] = useState(false);
   const [following, setFollowing] = useState(false);
   const [moderator, setModerator] = useState(false);
   const upvotePost_ = async () => {
      const data = await upvotePost(props.post._id);
      console.log("From Upvote", data);
      // console.log(">>> BEFORE FETCHING", subreddit)
      await fetchSubreddit(props.post.subreddit.name);
      // console.log(">>> AFTER FETCHING", subreddit)
      setUpvoted(data.upvote);
      setDownvoted(false);
      setNetUpvotes(data.voteCount);
   };
   const downvotePost_ = async () => {
      const data = await downvotePost(props.post._id);
      console.log("From Downvote", data);
      // console.log(">>> BEFORE FETCHING", subreddit)
      await fetchSubreddit(props.post.subreddit.name);
      // console.log(">>> AFTER FETCHING", subreddit)
      setDownvoted(data.downvote);
      setUpvoted(false);
      setNetUpvotes(data.voteCount);
   };
   const savePost_ = async () => {
      const data = await savePost(props.post);
      setSaved(data.saved);
      console.log(data);
   };
   const deletePost_ = async () => {
      if (window.confirm("Are you sure you want to delete this post")) {
         await deletePost(props.post._id, saved);
         console.log(props.post._id);
         console.log("Before deletion", subreddit.posts);
         await dispatch({ type: "REMOVE_POST_SUB", payload: props.post._id });
         // console.log(">>> BEFORE FETCHING", subreddit)
         await fetchSubreddit(props.post.subreddit.name);
         // console.log(">>> AFTER FETCHING", subreddit)
         console.log("After deletion", subreddit.posts);
      }
   };
   const followUser_ = async () => {
      const data = await followUser(props.post.author);
      // console.log(">>> BEFORE FETCHING", subreddit)
      await fetchSubreddit(props.post.subreddit.name);
      // console.log(">>> AFTER FETCHING", subreddit)
      setFollowing(data);
      console.log("From Follow", data);
   };
   useEffect(() => {
      console.log(props.post);
      if (!user.isLoading) {
         if (user.user) {
            console.log("USER EXISTS");
            setUpvoted(props.post.upvotedBy.includes(user.user.updatedUser._id));
            setDownvoted(
               props.post.downvotedBy.includes(user.user.updatedUser._id)
            );
            setNetUpvotes(props.post.upvotes - props.post.downvotes);
            if (
               user.user.updatedUser.saved_posts.filter(
                  (post) => post._id === props.post._id
               ).length > 0
            ) {
               setSaved(true);
            } else {
               setSaved(false);
            }
            //   console.log("USER EXISTS 3");
            setOwner(props.post.author === user.user.updatedUser._id);
            //   console.log("USER EXISTS 4");
            if (
               user.user.updatedUser.following.filter(
                  (f) => f._id === props.post.author
               ).length > 0
            ) {
               setFollowing(true);
            } else {
               setFollowing(false);
            }
            //   console.log("USER EXISTS 5");
         }
      }
   }, []);

   return (
      (!props.post ? (<Loading/>) : (<div>
         <div
            className="grid grid-cols-12 grid-flow-col max-w-3xl px-8 py-4 mx-auto mb-3 rounded-lg shadow-md dark:bg-secondary-focus cursor:auto">
            <div className="flex h-full text-secondary-content">
               <div className="flex flex-col justify-center items-center space-y-3">
                  <button onClick={upvotePost_}>
                     {upvoted ? <AiFillLike size={30}/> : <AiOutlineLike size={28}/>}
                  </button>
                  <div className="flex justify-center">{netUpvotes}</div>
                  <button onClick={downvotePost_}>
                     {downvoted ? (
                        <AiFillDislike size={30}/>
                     ) : (
                        <AiOutlineDislike size={28}/>
                     )}
                  </button>
               </div>
            </div>
            <div className="col-span-11">
               <div className="flex items-center justify-between">
            <span className="text-sm font-light text-base-content dark:text-base-content">
              posted on{" "}
               {new Date(props.post.createdAt).toLocaleDateString(
                  "en-US",
                  date_options
               )}
            </span>
                  <div className="flex space-x-4">
                     <p className="px-3 py-1 text-sm font-bold text-gray-100 bg-secondary rounded cursor-pointer">
                        g/{props.post.subreddit.name}
                     </p>
                     <button className="text-secondary-content" onClick={deletePost_}>
                        {owner ? <AiTwotoneDelete size={30}/> : <></>}
                     </button>
                  </div>
               </div>
               <div className="mt-2">
                  <a
                     href="https://reddit.com/"
                     className="text-2xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline"
                  >
                     {props.post.title}
                  </a>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                     {props.post.text}
                  </p>
               </div>
               <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-row justify-center items-start space-x-3 text-secondary-content">
                     <button onClick={savePost_}>
                        {saved ? (
                           <BsFillBookmarkCheckFill size={30}/>
                        ) : (
                           <BsBookmarkPlus size={28}/>
                        )}
                     </button>
                     <div className="flex flex-row items-center space-x-2">
                        <div>
                           <FaRegCommentAlt size={25}/>
                        </div>
                        <div>{props.post.comments.length} Comments</div>
                     </div>
                     {!owner ? (
                        <div className="italic">
                           <button onClick={() => setViewModal(true)}>
                              <BsFlag size={26}/>
                           </button>
                           <ModalReport
                              post_id={props.post._id}
                              isVisible={viewModal}
                              onClose={() => setViewModal(false)}
                           />
                        </div>
                     ) : (
                        <></>
                     )}
                  </div>
                  <div>
                     <Link
                        to={`/g/${props.post.subreddit.name}/post/${props.post._id}`}
                        state={{ post: props.post._id }}
                     >
                        <p className="text-blue-600 dark:text-blue-400 hover:underline">
                           Read more ⟶
                        </p>
                     </Link>
                  </div>
                  <div className="flex flex-row items-center space-x-3 justify-between">
                     <div>
                        <img
                           src="https://icon2.cleanpng.com/20190827/wbg/transparent-books-icon-ebooks-icon-g-icon-5d6b04fc3f62c5.8545363215672947162596.jpg"
                           alt="Author Photo"
                           className="hidden object-cover w-10 h-10 rounded-full sm:block"
                        />
                     </div>
                     <div>
                        <p className="font-bold text-gray-700 cursor-pointer dark:text-gray-200">
                           u/{props.post.username}
                        </p>
                     </div>
                     <div className="mx-5 text-secondary-content">
                        <button onClick={() => followUser_()}>
                           {owner ? (
                              <></>
                           ) : following ? (
                              <FaUserTimes size={30}/>
                           ) : (
                              <FiUserPlus size={30}/>
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>))
   );
};
export default PostSingle;
