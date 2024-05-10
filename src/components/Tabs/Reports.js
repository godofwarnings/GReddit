import { FaBan } from "react-icons/fa";
import { MdOutlineDeleteSweep, MdPersonRemove } from "react-icons/md";
import { CgFileRemove } from "react-icons/cg";
import { GoAlert, GoDiffIgnored } from "react-icons/go";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import lottie from "lottie-web";
import blocked from "../../lotties/blocked.gif";
import { Link } from "react-router-dom";

const Reports = ({ subreddit }) => {
   const [currSub, setCurrSub] = useState(null);
   const container = useRef(null);

   const instance = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: require("../../lotties/blocked.json"),
      preserveAspectRatio: "xMidYMid meet",
   });
   const { deletePostReport, user, blockPostReport, ignoreReport } =
      useContext(AuthContext);
   const date_options = {
      year: "numeric",
      month: "long",
      day: "numeric",
   };
   useEffect(() => {
      if (user.user) {
         console.log(
            user.user.updatedUser.subreddits_created.find(
               (sub) => sub._id === subreddit._id
            )
         );
         setCurrSub(
            user.user.updatedUser.subreddits_created.find(
               (sub) => sub._id === subreddit._id
            )
         );
      }
   }, [user.user]);

   const deletePost = async (id) => {
      await deletePostReport(id);
      console.log("Deleted report", id);
   };
   const blockUser = async (id) => {
      await blockPostReport(id);
      console.log("Blocked user", id);
   };
   const ignoreReport_ = async (id) => {
      await ignoreReport(id);
      console.log("Ignored report", id);
   };
   return (
      <div className="flex flex-col bg-neutral-content rounded-md">
         <div className="grid grid-cols-12 bg-accent p-3 rounded-md m-2">
            <div className="col-span-1">Reported By</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-4">Action</div>
            <div className="col-span-2">Concerning post</div>
            <div className="col-span-3">Concern</div>
            <div className="col-span-1">Status</div>
         </div>
         {currSub &&
            currSub.reports.map((report) => (
               <div key={report._id}>
                  <div className="grid grid-cols-12 text-primary-content p-3 rounded-md m-2 my-2">
                     <div className="col-span-1">
                        <div className="flex flex-col justify-center h-full">
                           u/{report.reporting_user.username}
                        </div>
                     </div>
                     <div className="col-span-1">
                        <div className="flex flex-col justify-center h-full">
                           {new Date(report.createdAt).toLocaleDateString(
                              "en-US",
                              date_options
                           )}
                        </div>
                     </div>
                     <div className="col-span-4 h-full">
                        <div className="flex flex-col justify-center h-full">
                           <div className="grid grid-cols-3 px-3 gap-2">
                              <div className="flex flex-row">
                                 {report.status === "ignored" ? (
                                    <button
                                       disabled
                                       className="w-full p-2 rounded-md bg-primary-content
                    text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <GoDiffIgnored size={26}/>
                                          </div>
                                          <div>
                                             <p>Ignored</p>
                                          </div>
                                       </div>
                                    </button>
                                 ) : report.status === "blocked" ? (
                                    <button
                                       disabled
                                       className="w-full p-2 rounded-md bg-primary-content
                    text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <GoDiffIgnored size={26}/>
                                          </div>
                                          <div>
                                             <p>Ignore</p>
                                          </div>
                                       </div>
                                    </button>
                                 ) : (
                                    <button
                                       onClick={() => ignoreReport(report._id)}
                                       className="w-full bg-primary p-2 rounded-md text-error-content hover:bg-primary-content
                    hover:text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <GoDiffIgnored size={26}/>
                                          </div>
                                          <div>
                                             <p>Ignore</p>
                                          </div>
                                       </div>
                                    </button>
                                 )}
                              </div>
                              <div className="flex flex-row">
                                 {report.status === "ignored" ? (
                                    <button
                                       disabled
                                       className="w-full p-2 rounded-md bg-primary-content
                    text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <CgFileRemove size={26}/>
                                          </div>
                                          <div>
                                             <p>Delete Post</p>
                                          </div>
                                       </div>
                                    </button>
                                 ) : report.status === "blocked" ? (
                                    <button
                                       disabled
                                       className="w-full p-2 rounded-md bg-primary-content
                    text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <CgFileRemove size={26}/>
                                          </div>
                                          <div>
                                             <p>Delete Post</p>
                                          </div>
                                       </div>
                                    </button>
                                 ) : (
                                    <button
                                       onClick={() => deletePost(report._id)}
                                       className="w-full bg-primary p-2 rounded-md text-error-content hover:bg-primary-content
                    hover:text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <CgFileRemove size={26}/>
                                          </div>
                                          <div>
                                             <p>Delete Post</p>
                                          </div>
                                       </div>
                                    </button>
                                 )}
                              </div>
                              <div className="flex flex-row">
                                 {report.status === "ignored" ? (
                                    <button
                                       disabled
                                       className="w-full p-2 rounded-md bg-primary-content
                    text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <FaBan size={26}/>
                                          </div>
                                          <div>
                                             <p>Block</p>
                                          </div>
                                       </div>
                                    </button>
                                 ) : report.status === "blocked" ? (
                                    <button
                                       disabled
                                       className="w-full p-2 rounded-md bg-primary-content
                    text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <FaBan size={26}/>
                                          </div>
                                          <div>
                                             <p>Blocked</p>
                                          </div>
                                       </div>
                                    </button>
                                 ) : (
                                    <button
                                       onClick={() => blockUser(report._id)}
                                       className="w-full bg-primary p-2 rounded-md text-error-content hover:bg-primary-content
                    hover:text-secondary-content"
                                    >
                                       <div className="flex flex-row justify-center space-x-6">
                                          <div>
                                             <FaBan size={26}/>
                                          </div>
                                          <div>
                                             <p>Ban User</p>
                                          </div>
                                       </div>
                                    </button>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-span-2">
                        <div className="flex flex-col justify-center h-full">
                           <Link
                              to={`/g/${report.associated_subreddit.name}/post/${report.associated_post}`}
                              state={{ post: report.associated_post }}
                           >
                              <p className="text-primary-content hover:underline">
                                 Click to visit the post
                              </p>
                           </Link>

                        </div>
                     </div>
                     <div className="col-span-3">
                        <div className="flex flex-col justify-center h-full">
                           {report.concern}
                        </div>
                     </div>
                     <div className="col-span-1">
                        <div className="flex flex-col justify-center h-full">
                           {report.status === "blocked" ? (
                              <span
                                 className="inline-flex items-center bg-error text-error-content text-md font-medium mr-2 px-2.5 py-0.5 rounded-full">
                      <span className="w-2 h-2 mr-1 bg-error-content rounded-full"></span>
                      Blocked
                    </span>
                           ) : report.status === "ignored" ? (
                              <span
                                 className="inline-flex items-center bg-secondary text-secondary-content text-md font-medium mr-2 px-2.5 py-0.5 rounded-full">
                      <span className="w-2 h-2 mr-1 bg-secondary-content rounded-full"></span>
                      Ignored
                    </span>
                           ) : (
                              <span
                                 className="inline-flex items-center bg-warning text-warning-content text-md font-medium mr-2 px-2.5 py-0.5 rounded-full">
                      <span className="w-2 h-2 mr-1 bg-warning-content rounded-full"></span>
                      Pending
                    </span>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-row justify-center">
                     <hr className="h-px w-[98%] bg-base-content border-0"/>
                  </div>
               </div>
            ))}
      </div>
   );
};

export default Reports;
