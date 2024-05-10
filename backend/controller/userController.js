const User = require("../models/userModel");
const Post = require("../models/postModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const createToken = (_id) => {
   return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "10d" });
};
//* @status: completed
//* @param : {id}
//* @body: {}
const removeFollowerUser = async (req, res) => {
   const { id } = req.params
   try {
      const user = await User.findById(req.user._id).populate("followers", "username").populate("following", "username")
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      const toRemove = await User.findById(id)
      if (!toRemove) {
         return res.status(404).json({ error: "The user asked to remove from followers was not found" });
      }
      if (user.followers.filter((follower) => follower._id.equals(id)).length > 0) {
         user.followers = user.followers.filter((follower) => !follower._id.equals(id))
         console.log(user.followers)
         user.followers_number -= 1
         await user.save();
         toRemove.following = toRemove.following.filter((f) => !f._id.equals(req.user._id))
         toRemove.following_number -= 1
         await toRemove.save();
         return res.status(200).json({ message: "Follower removed", updatedUser: user });
      } else {
         return res.status(400).json({ error: "No such follower" });
      }
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
}
//* @status: completed
//* @param : { id }
//* @body: {}
const removeFollowingUser = async (req, res) => {
   const { id } = req.params
   try {
      const user = await User.findById(req.user._id).populate("followers", "username").populate("following", "username")
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      const toRemove = await User.findById(id)
      if (!toRemove) {
         return res.status(404).json({ error: "The user asked to remove from following was not found" });
      }
      const usernameToRemove = toRemove.username
      if (user.following.filter((following) => following._id.equals(id)).length > 0) {
         user.following = user.following.filter((following) => !following._id.equals(id))
         console.log(user.following)
         user.following_number -= 1
         await user.save();
         toRemove.followers = toRemove.followers.filter((f) => !f._id.equals(req.user._id))
         toRemove.followers_number -= 1
         await toRemove.save();
         return res.status(200).json({ message: `${usernameToRemove} unfollowed`, updatedUser: user });
      } else {
         return res.status(400).json({ error: "No such follower" });
      }
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
}
//* @status: completed
//* @param : {}
//* @body: {}
const getUsers = async (req, res) => {
   const users = await User.find({}).sort({ createdAt: -1 }).select("-password"); // -1 is for descending order

   //alternate to the select() method
   /*const dataUsers = users.map((data) => {
        return {
          fname: data.fname,
          lname: data.lname,
        username: data.username,
          age: data.age,
          emailID: data.emailID,
        };
      });
     */
   return res.status(200).json(users);
};
//* @status: completed
//* @param : {user._id}
//* @body: {}
const getUser = async (req, res) => {
   const id = req.user._id;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid ID type" });
   }
   try {
      const user = await User.findById(id).select(
         "-password"
      ).populate('followers', 'username').populate('following', 'username').populate({
         path: "posts",
         populate: { path: "subreddit", select: "name" },
      }).populate({
         path: "saved_posts",
         populate: { path: "subreddit", select: "name" },
      }).populate({
         path: "subreddits_created",
         populate: [{ path: "followers", populate: "username emailID" }, {
            path: "blocked_users",
            populate: "username emailID"
         },
            { path: "left_users", populate: "username emailID" }, {
               path: "join_requests",
               populate: "username emailID"
            }, {
               path: "reports",
               populate: [
                  { path: "reporting_user", populate: "username emailID" },
                  { path: "reported_user", populate: "username emailID" },
                  { path: "associated_subreddit", populate: "name" }]
            }]
      });
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      console.log(" YO ", user.subreddits_created)
      res.status(200).json(user);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};
// Delete a user
//* @status: incomplete // add the feature only a user can delete themselves,
//* @param : {user._id}
//* @body: {}
const deleteUser = async (req, res) => {
   try {
      const user = await User.findById(req.user._id);
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      await user.remove();
      res.status(200).json(user);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};
// Update a user
const updateUser = async (req, res) => {
   const { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid ID type" });
   }

   const user = await User.findOneAndUpdate(
      { _id: id },
      {
         ...req.body,
      }
   );

   if (!user) {
      return res.status(404).json({ error: "User not found" });
   }

   res.status(200).json(user);
};
// login a user
const loginUser = async (req, res) => {
   const { emailID, password } = req.body;
   console.log(emailID, password);
   try {
      const user = await User.login(emailID, password);
      const token = createToken(user._id); // create JWT

      const updatedUser = JSON.parse(JSON.stringify(user));
      delete updatedUser.password; // or updatedUser.password = undefined

      res.status(200).json({ updatedUser, token });
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};
// signup user
const signupUser = async (req, res) => {
   const { fname, lname, username, age, emailID, password } = req.body; // destructuring the body
   console.log(req.body)
   try {
      const user = await User.signup(
         fname,
         lname,
         username,
         age,
         emailID,
         password
      );
      // create JWT
      const token = createToken(user._id);
      const updatedUser = JSON.parse(JSON.stringify(user));
      delete updatedUser.password; // or updatedUser.password = undefined
      res.status(200).json({ updatedUser, token });
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};
//* @status: completed
//* @param : {}
//* @body: {}
const followUser = async (req, res) => {
   const { id } = req.params
   try {
      console.log(id, req.user._id)
      if (req.user._id.equals(id)) {
         console.log("User cannot follow themselves")
         return res.status(400).json({ message: "User cannot follow themselves" });
      }
      const user = await User.findById(req.user._id).populate("followers", "username").populate("following", "username")
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      const toFollow = await User.findById(id)
      if (!toFollow) {
         return res.status(404).json({ error: "The user asked to follow was not found" });
      }
      if (user.following.filter((following) => following._id.equals(id)).length === 0) {
         user.following.push(id)
         user.following_number += 1
         await user.save()
         await user.populate('following', 'username')
         console.log(user.following)
         console.log("BEFORE PUSHING", toFollow)
         toFollow.followers_number += 1
         toFollow.followers.push(req.user._id)
         console.log("AFTER PUSHING", toFollow)
         await toFollow.save()
         await toFollow.populate('followers', 'username')
         console.log("AFTER PUSHING and populating", toFollow)
         return res.status(200).json({ message: "User Followed", updatedUser: user, status: true });
      } else {
         console.log(">>> BEFORE UNFOLLOWING", user.following, id)
         user.following = user.following.filter((following) => !following._id.equals(id))
         user.following_number -= 1
         await user.save()
         console.log(">>> AFTER UNFOLLOWING", user.following)
         return res.status(200).json({ message: "User unfollowed", updatedUser: user, status: false });
      }
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
}
module.exports = {
   getUser,
   getUsers,
   deleteUser,
   updateUser,
   loginUser,
   signupUser,
   removeFollowerUser,
   removeFollowingUser,
   followUser
};
