import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import TabNavItem from "../components/Tabs/TabNavItem";
import TabContent from "../components/Tabs/TabContent";
import SubredditUsers from "../components/Tabs/SubredditUsers";
import Requests from "../components/Tabs/Requests";
import Reports from "../components/Tabs/Reports";


import About from "../components/Tabs/About";
import PostPage from "../components/Tabs/PostPage";
import SavedPosts from "../components/Tabs/SavedPosts";
import MySubreddits from "../components/Tabs/MySubreddits";
import Statistics from "../components/Tabs/Statistics";

const PostDetailsPage = (props) => {
   const { name } = useParams()
   const { user } = useContext(AuthContext)
   const [currSubredditPage, setCurrSubredditPage] = useState(null)
   const [activeTab, setActiveTab] = useState("tab1");
   useEffect(() => {
      if (user.user.updatedUser.subreddits_created) {
         setCurrSubredditPage(user.user.updatedUser.subreddits_created.find((sub) => sub.name === name))
      }
   })
   return (
      <div className="bg-base-100 mt-0">
         <div className="flex flex-row justify-start space-x-10 m-5 bg-primary p-5 rounded-md">
            <div className="rounded-full">
               <img
                  className="h-[80px]"
                  src="https://communitiesdelegation.org/wp-content/uploads/2020/11/community-icon.png"
                  alt="Image will go here"
               />
            </div>
            <div className="flex flex-col items-center text-primary-content">
               <div>
                  <h1 className="text-5xl font-bold">
                     {currSubredditPage && currSubredditPage.name}
                  </h1>
               </div>
               <div>g/{currSubredditPage && currSubredditPage.name}</div>
            </div>
         </div>
         <div className="Tabs bg-base-100">
            <ul className="nav">
               <TabNavItem
                  title="Users"
                  id="users"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
               />
               <TabNavItem
                  title="Join requests"
                  id="requests"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
               />
               <TabNavItem
                  title="Statistics"
                  id="statistics"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
               />
               <TabNavItem
                  title="Reports"
                  id="reports"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
               />
            </ul>

            <div className="outlet">
               <TabContent id="users" activeTab={activeTab} children={<SubredditUsers subreddit={currSubredditPage}/>}/>
               <TabContent id="requests" activeTab={activeTab} children={<Requests subreddit={currSubredditPage}/>}/>
               <TabContent id="statistics" activeTab={activeTab} children={<Statistics/>}/>
               <TabContent id="reports" activeTab={activeTab} children={<Reports subreddit={currSubredditPage}/>}/>
            </div>
         </div>
      </div>
   );
};

export default PostDetailsPage;
