import React, { useState } from "react";

import About from "./About";
import PostPage from "./PostPage";
import SavedPosts from "./SavedPosts";

import TabNavItem from "./TabNavItem";
import TabContent from "./TabContent";
import MySubreddits from "./MySubreddits";

const Tabs = () => {
   const [activeTab, setActiveTab] = useState("tab1");

   return (
      <div className="Tabs bg-base-100">
         <ul className="nav">
            <TabNavItem
               title="About"
               id="about"
               activeTab={activeTab}
               setActiveTab={setActiveTab}
            />
            <TabNavItem
               title="Posts"
               id="posts"
               activeTab={activeTab}
               setActiveTab={setActiveTab}
            />
            <TabNavItem
               title="Saved Posts"
               id="saved_posts"
               activeTab={activeTab}
               setActiveTab={setActiveTab}
            />
            <TabNavItem
               title="My Subgreddiits"
               id="subreddits"
               activeTab={activeTab}
               setActiveTab={setActiveTab}
            />
         </ul>

         <div className="outlet">
            <TabContent id="about" activeTab={activeTab} children={<About/>}/>
            <TabContent id="posts" activeTab={activeTab} children={<PostPage/>}/>
            <TabContent
               id="saved_posts"
               activeTab={activeTab}
               children={<SavedPosts/>}
            />
            <TabContent id="subreddits" activeTab={activeTab} children={<MySubreddits/>}/>
         </div>
      </div>
   );
};

export default Tabs;
