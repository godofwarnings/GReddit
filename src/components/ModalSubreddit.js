import { AiFillCloseSquare } from "react-icons/ai";
import bgImage from "../images/bg-6.jpg";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { SubredditContext } from "../context/SubredditContext";

const ModalSubreddit = ({ isVisible, onClose }) => {
   const { createPost, createSubreddit } = useContext(AuthContext);
   const { subreddit, dispatch } = useContext(SubredditContext);
   const backgroundImageStyle = {
      backgroundImage: `url("${bgImage}")`,
   };
   const [name, setName] = useState(null);
   const [description, setDescription] = useState(null);
   const [tags, setTags] = useState(null);
   const [bannedKeywords, setBannedKeywords] = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (tags === "" || tags === null) {
         setTags([""]);
      } else {
         const split_ = tags.split(" ")
         console.log(split_)
         setTags(split_);
      }
      if (bannedKeywords === "" || bannedKeywords === null) {
         setBannedKeywords([""]);
      } else {
         const split_ = bannedKeywords.split(" ")
         console.log(split_)
         setBannedKeywords(split_);
      }
      onClose();
      await createSubreddit(name, description, tags, bannedKeywords)
   };
   return (
      <div>
         {isVisible ? (
            <div
               id="wrapper"
               className="flex justify-center items-center fixed inset-0 bg-base-100 bg-opacity-25 text-secondary-content backdrop-blur-sm"
            >
               <div className="flex flex-col w-[600px]">
                  <div>
                     <button className="place-self-end" onClick={() => onClose()}>
                        <AiFillCloseSquare size={30} color={"white"}/>
                     </button>
                     <div className="card lg:card-side bg-primary-content shadow-xl w-full h-full bg-center bg-cover">
                        <div className="card-body">
                           <h2 className="card-title text-4xl">
                              Create a New Subreddit
                           </h2>
                           <form onSubmit={handleSubmit}>
                              <div className="grid grid-rows-4 space-y-0">
                                 <div className="form-group mt-5">
                                    <label className=" text-2xl">
                                       Name
                                       <input
                                          className="px-3
                            py-1.5 text-base form-control w-full placeholder:text-neutral-focus block bg-primary-focus rounded-md
                            transition ease-in-out m-0
                            focus:text-neutral focus:bg-primary focus:border-black"
                                          name="name"
                                          onChange={(e) => {
                                             setName(e.target.value);
                                          }}
                                          type="text"
                                          placeholder="Name"
                                          required
                                       />
                                    </label>
                                 </div>
                                 <div className="form-group">
                                    <label className=" text-2xl mb-0">
                                       Description
                                       <input
                                          className="px-3
                    py-1.5 text-base form-control w-full placeholder:text-neutral-focus block bg-primary-focus rounded-md
                    transition ease-in-out m-0
                    focus:text-neutral focus:bg-primary focus:border-black"
                                          name="description"
                                          onChange={(e) => {
                                             setDescription(e.target.value);
                                          }}
                                          type="text"
                                          placeholder="Description..."
                                          required
                                       />
                                    </label>
                                 </div>
                                 <div className="form-group">
                                    <label className=" text-2xl mb-0">
                                       Tags
                                       <input
                                          className="px-3
                            py-1.5 text-base form-control w-full placeholder:text-neutral-focus block bg-primary-focus rounded-md
                            transition ease-in-out m-0
                            focus:text-neutral focus:bg-primary focus:border-black"
                                          name="subreddit"
                                          onChange={(e) => {
                                             setTags(e.target.value);
                                          }}
                                          type="text"
                                          placeholder={"Please enter space seperated tags"}
                                       />
                                    </label>
                                 </div>
                                 <div className="form-group">
                                    <label className=" text-2xl mb-0">
                                       Banned Keywords
                                       <input
                                          className="px-3
                            py-1.5 text-base form-control w-full placeholder:text-neutral-focus block bg-primary-focus rounded-md
                            transition ease-in-out m-0
                            focus:text-neutral focus:bg-primary focus:border-black"
                                          name="subreddit"
                                          onChange={(e) => {
                                             setBannedKeywords(e.target.value);
                                          }}
                                          type="text"
                                          placeholder={
                                             "Please enter space seperated banned keywords"
                                          }
                                       />
                                    </label>
                                 </div>
                              </div>
                              <div className="card-actions justify-end">
                                 <button className="btn btn-primary">Create</button>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <></>
         )}
      </div>
   );
};

export default ModalSubreddit;
