import { useLocation } from "react-router-dom";
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
import { FaUserTimes, FaRegCommentAlt } from "react-icons/fa";

//* Other Imports
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SubredditContext } from "../context/SubredditContext";
import { useStore } from "react-redux";
import ModalPost from "../components/ModalPost";
import ModalReport from "../components/ModalReport";
import Loading from "./Loading";
import NotFoundPage from "./NotFoundPage";

const PostDetailsPage = () => {
   const date_options = {
      year: "numeric",
      month: "long",
      day: "numeric",
   };
   const location = useLocation();
   const props_post = !location.state ? null : location.state.post;
   const [currPost, setCurrPost] = useState(null)
   const {
      user,
      savePost,
      upvotePost,
      downvotePost,
      deletePost,
      followUser,
      addComment, initUser
   } = useContext(AuthContext);
   const { subreddit, dispatch, fetchSubreddit, isLoading } = useContext(SubredditContext);
   const [upvoted, setUpvoted] = useState(false);
   const [downvoted, setDownvoted] = useState(false);
   const [netUpvotes, setNetUpvotes] = useState(0);
   const [saved, setSaved] = useState(false);
   const [owner, setOwner] = useState(false);
   const [following, setFollowing] = useState(false);
   const [comment, setComment] = useState('');
   const upvotePost_ = async () => {
      const data = await upvotePost(currPost._id);
      console.log("From Upvote", data);
      await fetchSubreddit(currPost.subreddit.name)
      setUpvoted(data.upvote);
      setDownvoted(false);
      setNetUpvotes(data.voteCount);
   };
   const downvotePost_ = async () => {
      const data = await downvotePost(currPost._id);
      console.log("From Downvote", data);
      setDownvoted(data.downvote);
      setUpvoted(false);
      setNetUpvotes(data.voteCount);
      await fetchSubreddit(currPost.subreddit.name)
   };
   const savePost_ = async () => {
      const data = await savePost(currPost);
      setSaved(data.saved);
      console.log(data);
   };
   const deletePost_ = async () => {
      if (window.confirm("Are you sure you want to delete this post")) {
         await deletePost(currPost._id, saved);
         console.log(currPost._id);
         console.log("Before deletion", subreddit.posts);
         await dispatch({ type: "REMOVE_POST_SUB", payload: currPost._id });
         await fetchSubreddit(currPost.subreddit.name)
         console.log("After deletion", subreddit.posts);
      }
   };
   const handleComment = (event) => {
      setComment(event.target.value)
   }
   const handleSubmit = async (event) => {
      event.preventDefault();
      await addComment(comment, currPost._id)
      await fetchSubreddit(currPost.subreddit.name)
      console.log(comment)
   }
   const followUser_ = async () => {
      const data = await followUser(currPost.author);
      await fetchSubreddit(currPost.subreddit.name)
      setFollowing(data);
      console.log("From Follow", data);
   };

   useEffect(() => {
      console.log(currPost);
      if (props_post) {
         if (!user.isLoading) {
            if (user.user) {
               console.log("USER EXISTS");
               if (currPost) {
                  setUpvoted(currPost.upvotedBy.includes(user.user.updatedUser._id));
                  setDownvoted(
                     currPost.downvotedBy.includes(user.user.updatedUser._id)
                  );
                  setNetUpvotes(currPost.upvotes - currPost.downvotes);
                  if (
                     user.user.updatedUser.saved_posts.filter(
                        (post) => post._id === currPost._id
                     ).length > 0
                  ) {
                     setSaved(true);
                  } else {
                     setSaved(false);
                  }
                  setOwner(currPost.author === user.user.updatedUser._id);
                  if (
                     user.user.updatedUser.following.filter(
                        (f) => f._id === currPost.author
                     ).length > 0
                  ) {
                     setFollowing(true);
                  } else {
                     setFollowing(false);
                  }
               }
            }
         }
         if (subreddit && subreddit.posts) {
            console.log("SUBREDDIT EXISTSTSTS", subreddit)
            setCurrPost(subreddit.posts.find((post) => post._id === props_post))
         }
      }
   }, [subreddit, currPost, user.user]);
   return (
      (!location.state ? (<NotFoundPage/>) : isLoading ? (<Loading/>) : (<div className="flex flex-col justify-start">
         <div>
            <div>
               <div
                  className="grid grid-cols-12 grid-flow-col w-full px-8 py-4 mx-auto mb-3 rounded-lg shadow-md dark:bg-secondary-focus cursor:auto">
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
              posted on {currPost && (new Date(currPost.createdAt)).toLocaleDateString("en-US", date_options)}
            </span>
                        <div className="flex space-x-4">
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
                           {currPost && currPost.title}
                        </a>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                           {currPost && currPost.text}
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
                              <div>{currPost && currPost.comments.length} Comments</div>
                           </div>
                           <div className="italic">
                              <BsFlag size={26}/>
                           </div>
                        </div>
                        <div>
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
                                 u/{currPost && currPost.username}
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
            </div>
         </div>
         <div>
            <div>
               <div className="text-4xl my-2">
                  Comments({currPost && currPost.comments.length})
               </div>
               <form className="py-6 px-6 bg-secondary rounded-t-md" onSubmit={(e) => handleSubmit(e)}>
                  <div className="py-2 px-4 mb-4 rounded-lg rounded-t-lg border
                         border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                     <textarea onChange={(e) => handleComment(e)} id="comment" rows="6"
                               className="px-0 w-full text-sm text-neutral-content border-0 focus:ring-0 focus:outline-none
                             dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                               placeholder="Write a comment..."
                               value={comment}
                               required/>
                  </div>
                  <button type="submit"
                          className="inline-flex items-center py-2.5 px-4 text-xs font-medium
                        text-center text-neutral-content rounded-lg focus:ring-4
                         bg-accent hover:bg-blue-400"
                  >
                     Post comment
                  </button>
               </form>
               {currPost && currPost.comments.map((comment) => (
                  <div className="pt-4 pb-2 px-6 text-neutral-content bg-secondary">
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                           <div>
                              <p className="inline-flex items-center mr-3 text-sm font-bold">
                                 u/{comment.username}
                              </p>
                           </div>
                           <div>
                              <p className="text-sm">
                                 <time>
                                    {(new Date(comment.date)).toLocaleDateString("en-US", date_options)}
                                 </time>
                              </p>
                           </div>
                        </div>
                     </div>
                     {/* Comment text */}
                     <div>
                        <p className="text-accent-content">
                           {comment.text}
                        </p>
                     </div>
                     {/* separator */}
                     <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
                  </div>
               ))}
            </div>
         </div>
      </div>))
   )
      ;
};

export default PostDetailsPage;
