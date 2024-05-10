import React, { useContext, useState } from 'react';
import { AuthContext } from "../../context/AuthContext";
import MySubredditSingle from "../MySubredditSingle";
import ModalSubreddit from "../ModalSubreddit";
import { IoCreateOutline } from "react-icons/io5";

const MySubreddits = () => {
   const { user } = useContext(AuthContext)
   const [viewModal, setViewModal] = useState(false)
   return (
      <div className='flex flex-col justify-start items-center'>
         <div className='flex flex-col justify-start items-center space-y-4 w-[60%] rounded-md'>
            <div className='flex flex-row justify-center space-x-2 bg-base-content max-w-3xl w-full rounded-md px-3'>
               <label className='text-4xl my-4'>
                  Create a new Subreddit
                  <ModalSubreddit isVisible={viewModal} onClose={() => setViewModal(false)}/>
               </label>
               <button onClick={() => setViewModal(true)}><IoCreateOutline size={35}/></button>
            </div>
            <div className='w-full'>
               {user.user.updatedUser.subreddits_created &&
                  user.user.updatedUser.subreddits_created.map((subreddit) => (<MySubredditSingle key={subreddit._id} subreddit={subreddit}/>))}
            </div>
         </div>
      </div>
   );
};

export default MySubreddits;
