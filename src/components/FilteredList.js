import React from "react";
import { SingleSub } from "../pages/AllSubreddits";

function FilteredList({ filteredSubs, userId }) {
  console.log(userId);
  function checkStatus(sub) {
    console.log(">>> BOTH", sub.creator, userId);
    if (sub.creator === userId) {
      return "moderator";
    } else if (sub.followers.includes(userId)) {
      return "member";
    } else {
      return "new";
    }
  }

  const filtered = filteredSubs.map((sub) => (
    <SingleSub key={sub._id} sub={sub} isMember={checkStatus(sub)} />
  ));
  return <div>{filtered}</div>;
}

export default FilteredList;
