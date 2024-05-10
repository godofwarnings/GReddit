const SubReddit = require("../models/subredditModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Subreddit = require("../models/subredditModel");
const lodash = require("lodash");
//* @status:
//* @param : {}
//* @body: {}

//* @status: completed
//* @param : {}
//* @body:   {subreddit.name, subreddit.description}
const createSubreddit = async (req, res) => {
   const { name, description, tags, banned_keywords } = req.body;
   try {
      const creator_id = await User.findById(req.user._id);
      if (!creator_id) {
         return res.status(404).json({ error: "Creator not found" });
      }
      const subreddit = await Subreddit.create({
         name,
         description,
         creator: creator_id._id,
         moderator: creator_id._id,
         tags,
         banned_keywords
      });
      creator_id.subreddits_created.push(subreddit._id);
      creator_id.subreddits_joined.push(subreddit._id)
      subreddit.followers.push(subreddit.creator);
      await subreddit.save();
      await creator_id.save()
      res.status(200).json(subreddit);
   } catch (err) {
      res.status(500).json({ error: err.messsage });
   }
};
//* @status: completed
//* @param : {subreddit.name}
//* @body:   {}
const getSubreddit = async (req, res) => {
   try {
      const { name } = req.params;
      const subreddit = await SubReddit.findOne({ name }).populate({
         path: "posts",
         populate: { path: "subreddit", select: "name" },
      }).populate("reports");
      if (!subreddit) {
         return res.status(404).json({ error: "SubGreddiit not found" });
      }
      res.status(200).json(subreddit);
   } catch (error) {
      res.status(500).json({ error: error.messsage });
   }
};
//* @status: completed
//* @param : {}
//* @body:   {}
const getSubreddits = async (req, res) => {
   try {
      const subreddits = await SubReddit.find({}).sort({ createdAt: -1 });
      if (subreddits.length === 0) {
         return res.status(200).json({ message: "No SubGreddiits found" });
      }
      res.status(200).json(subreddits);
   } catch (error) {
      res.status(500).json({ error: error.messsage });
   }
};

//* @status: completed
//* @param : {subreddit.name}
//* @body:   {}
const deleteSubreddit = async (req, res) => {
   const { name } = req.params;
   try {
      const user = await User.findById(req.user._id);
      const subreddit = await SubReddit.findOne({ name: name });
      if (!subreddit) {
         return res.status(404).json({ error: "SubGreddiit not found" });
      }
      const posts = await Post.find({ _id: { $in: subreddit.posts } });
      // check if user is the creator of the subreddit
      if (subreddit.creator.equals(req.user._id)) {
         // console.log(subreddit.posts);
         if (subreddit.posts.length > 0) {
            subreddit.posts.map(async (id) => {
               const post = await Post.findById(id);
               // const testing = await User.find({ saved_posts: id });
               // console.log(id, testing);
               await post.remove();
            });
         }
         console.log(">>>BEFORE USER CCSCSCSCS", user.subreddits_created, "IDIDIDI", subreddit._id)
         // user.subreddits_created = user.subreddits_created.filter((sub) => {
         //    subreddit._id.toString() != subreddit._id.toString()
         // })
         console.log(user.subreddits_created.filter((sub) => {
            subreddit._id.toString() != subreddit._id.toString()
         }))
         await user.save()
         await subreddit.remove();
         return res.json({
            message: "Subgreddiit removed successfully",
         });
      } else {
         res.status(401).json({ message: "User not authorized" });
      }
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};
//* @status: completed
//* @param : {subreddit.name}
//* @body:   {}
const joinRequestSubreddit = async (req, res) => {
   const { name } = req.params;
   try {
      const subreddit = await SubReddit.findOne({ name });
      if (!subreddit) {
         return res.status(404).json({ message: "No such SubGrediit exists!" });
      }
      const user = await User.findById(req.user._id);
      const result_left = subreddit.left_users.filter((left_user) =>
         left_user.equals(user._id)
      );
      const result_requested = subreddit.join_requests.filter((request) =>
         request.equals(user._id)
      );
      if (result_left.length > 0) {
         return res
            .status(200)
            .json({ message: "You cannot join the Sub once you've left it" });
      }
      if (result_requested.length > 0) {
         return res
            .status(200)
            .json({ message: "You have already requested to join the Sub" });
      }
      subreddit.join_requests.push(user._id);
      await subreddit.save();
      res.status(200).json({ message: "Succesfully requested" });
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};
const handleRequestSubreddit = async (req, res) => {
   const { id, action, name } = req.params;
   console.log("id", id, "action", action, "name", name);
   try {
      const subreddit = await Subreddit.findOne({ name })
      if (!subreddit.creator.equals(req.user._id)) {
         return res.status(401).json({ message: "You are not authorized" })
      }
      if (action === "accept") {
         console.log(">>> BEFORE", subreddit)
         subreddit.join_requests = subreddit.join_requests.filter((request) => !request.equals(id))
         subreddit.followers.push(id)
         subreddit.followers_number += 1
         await subreddit.save()
         console.log(">>> After", subreddit)
         return res.status(200).json({ message: "request accepted", status: true })
      } else if (action === "reject") {
         console.log(">>> BEFORE", subreddit)
         subreddit.join_requests = subreddit.join_requests.filter((request) => !request.equals(id))
         subreddit.rejected_requests.push(id)
         await subreddit.save()
         console.log(">>> AFTER", subreddit)
         return res.status(200).json({ message: "request rejected", status: false })
      } else {
         return res.status(400).json({ message: "Invalid action" })
      }
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
}
const leaveSubreddit = async (req, res) => {
   const { name } = req.params;
   try {
      const subreddit = await SubReddit.findOne({ name });
      if (!subreddit) {
         return res.status(404).json({ message: "No such SubGrediit exists!" });
      }
      const user = await User.findById(req.user._id);
      const result_left = subreddit.left_users.filter((left_user) =>
         left_user.equals(user._id)
      );
      const result_requested = subreddit.join_requests.filter((request) =>
         request.equals(user._id)
      );
      if (result_left.length > 0) {
         return res
            .status(401)
            .json({ message: "You cannot leave a Sub you've already left it" });
      }
      if (result_requested.length > 0) {
         return res
            .status(401)
            .json({ message: "You cannot leave a sub you have requested to join" });
      }
      subreddit.left_users.push(user._id);
      subreddit.followers_number -= 1
      subreddit.followers = subreddit.followers.filter((follower) => !follower.equals(user._id))
      await subreddit.save();
      res.status(200).json({ message: "Succesfully left" });
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
}
module.exports = {
   createSubreddit,
   getSubreddit,
   deleteSubreddit,
   getSubreddits,
   joinRequestSubreddit,
   handleRequestSubreddit,
   leaveSubreddit
};
