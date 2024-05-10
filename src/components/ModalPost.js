import { AiFillCloseSquare } from "react-icons/ai"
import bgImage from "../images/bg-6.jpg";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { SubredditContext } from "../context/SubredditContext";

const ModalPost = ({ isVisible, onClose, subredditName }) => {
   const { createPost } = useContext(AuthContext)
   const { subreddit, dispatch } = useContext(SubredditContext);
   const backgroundImageStyle = {
      backgroundImage: `url("${bgImage}")`,
   };
   const [title, setTitle] = useState(null);
   const [content, setContent] = useState(null);
   const handleSubmit = async (e) => {
      e.preventDefault()
      const post = await createPost(title, content, subredditName)
      console.log(post)
      if (post && subreddit.posts) {
         dispatch({ type: 'ADD_POST_SUB', payload: post })
         console.log("Dispatched successfully")
         onClose()
      }
      else {
         alert("There was an error. Please try again")
      }
   }
   return (
      <div>
         {
            isVisible ? (
               <div id="wrapper"
                    className="flex justify-center items-center fixed inset-0 bg-base-100 bg-opacity-25 text-secondary-content backdrop-blur-sm">
                  <div className="flex flex-col w-[600px]">
                     <div>
                        <button className="place-self-end" onClick={() => onClose()}>
                           <AiFillCloseSquare size={30} color={"white"}/>
                        </button>
                        <div
                           className="card lg:card-side bg-primary-content shadow-xl w-full h-full bg-center bg-cover">
                           <div className="card-body">
                              <h2 className="card-title text-4xl">Create New Post</h2>
                              <form onSubmit={handleSubmit}>
                                 <div className="grid grid-rows-3 space-y-0">
                                    <div className="form-group mt-5">
                                       <label className=" text-2xl">
                                          Title
                                          <input
                                             className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-primary-content rounded-md
                    transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-primary-focus focus:border-black"
                                             name="title"
                                             onChange={(e) => {
                                                setTitle(e.target.value)
                                             }}
                                             type="text"
                                             placeholder="Title"
                                             required
                                          />
                                       </label>
                                    </div>
                                    <div className="form-group">
                                       <label className=" text-2xl mb-0">
                                          Content
                                          <input
                                             className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-primary-content rounded-md
                    transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-primary-focus focus:border-black"
                                             name="text"
                                             onChange={(e) => {
                                                setContent(e.target.value)
                                             }}
                                             type="text"
                                             placeholder="Content"
                                             required
                                          />
                                       </label>
                                    </div>
                                    <div className="form-group">
                                       <label className=" text-2xl mb-0">
                                          Sub Greddiit
                                          <input
                                             className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-primary-focus rounded-md"
                                             name="subreddit"
                                             onChange={() => {
                                             }}
                                             type="text"
                                             placeholder={'g/' + subredditName}
                                             disabled={true}
                                          />
                                       </label>
                                    </div>
                                 </div>
                                 <div className=" card-actions justify-end">
                                    <button className=" btn btn-primary">Create</button>
                                 </div>
                              </form>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>) : (<></>)
         }
      </div>
   )
      ;
};

export default ModalPost;
