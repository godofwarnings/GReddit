import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike, AiTwotoneDelete } from "react-icons/ai";
import { BsBookmarkPlus, BsFillBookmarkCheckFill } from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";
import { BsFillPeopleFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const MySubredditSingle = ({ subreddit }) => {
   const date_options = {
      year: "numeric",
      month: "long",
      day: "numeric",
   };
   const { removeSubreddit } = useContext(AuthContext)
   const deleteSub = async () => {
      console.log("tried to delete")
      // await removeSubreddit(subreddit.name)
   }
   return (
      <div>
         <div className="max-w-3xl px-8 py-4 mx-auto mb-3 rounded-lg bg-secondary shadow-md cursor:auto">
            <div className="flex items-center justify-between">
               <div className='flex flex-row justify-between w-full'>
                  <div className="text-sm font-light text-secondary-content">
                     created on {(new Date(subreddit.createdAt)).toLocaleDateString("en-US", date_options)}
                  </div>
                  <div>
                     <button onClick={deleteSub} className="text-secondary-content">
                        <AiTwotoneDelete size={30}/>
                     </button>
                  </div>
               </div>
            </div>
            <div className="mt-2">
               <div className="flex flex-col space-y-2 items-start">
                  <p
                     className="text-4xl font-bold text-secondary-content dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline"
                  >
                     g/{subreddit.name}
                  </p>
                  <div className="flex flex-row justify-center items-center space-x-2">
                     <div>
                        <BsFillPeopleFill/>
                     </div>
                     <div>{subreddit.followers_number}</div>
                  </div>
               </div>
               <div className='flex flex-col'>
                  <div>
                     <p className="mt-2 text-info dark:base-300 text-md">Description : {subreddit.description}</p>
                  </div>
                  <div>
                     <p className="mt-2 text-info dark:base-300 text-md">Tags
                        : {(subreddit.tags[0] === "" && subreddit.tags.length === 1) ? (
                           <p className='inline'>No tags</p>) : subreddit.tags}</p>
                  </div>
                  <div>
                     <p className="mt-2 text-info dark:base-300 text-md">Banned Keywords
                        : {(subreddit.banned_keywords[0] === "" && subreddit.banned_keywords.length === 1) ? (
                           <p className='inline'>No Banned Keywords</p>) : subreddit.banned_keywords}</p>
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-between mt-4">
               <div className="flex flex-row justify-center items-start space-x-2">
                  <div className="flex justify-center">
                     {subreddit.posts_number + " "}Posts{"  "}
                  </div>
                  <div className="flex justify-center">
                     {"·   " + subreddit.followers_number + " "} {subreddit.followers_number === 1 ? "Member" : "Members"}
                  </div>
               </div>
               {/*<Link to={"post/" + props.post._id.toString()} state={{ post: props.post }}>*/}
               <div>
                  <NavLink to={`/u/g/${subreddit.name}`}>
                     <p className="text-blue-600 dark:text-blue-400 hover:underline">Go to the Moderator view ⟶</p>
                  </NavLink>
                  <NavLink to={`/g/${subreddit.name}`}>
                     <p className="text-blue-600 dark:text-blue-400 hover:underline">Go to Subreddit page⟶</p>
                  </NavLink>
               </div>
               {/*</Link>*/}
               <div className="flex items-center">
                  <img
                     src="https://icon2.cleanpng.com/20190827/wbg/transparent-books-icon-ebooks-icon-g-icon-5d6b04fc3f62c5.8545363215672947162596.jpg"
                     alt="Author Photo"
                     className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default MySubredditSingle;
