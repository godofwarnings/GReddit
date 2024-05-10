const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const { check, validationResult } = require("express-validator");
const Schema = mongoose.Schema;
const Subreddit = require('./subredditModel')

const userSchema = new Schema(
   {
      fname: {
         type: String,
         required: true,
      },
      lname: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
         unique: true,
      },
      age: {
         type: Number,
         required: true,
      },
      contact: {
         type: Number,
         required: false,
      },
      emailID: {
         type: String,
         required: true,
         unique: true,
         // validate: [isEmail, "Please enter a valid email address"], // add only in deployment and final testing
      },
      password: {
         type: String,
         required: true,
      },
      posts: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "Post",
      },
      saved_posts: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "Post",
      }
      ,
      followers_number: {
         type: Number,
         required: false,
         default: 0,
      },
      followers: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "User",
      },
      following_number: {
         type: Number,
         required: false,
         default: 0,
      },
      following: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "User",
      },
      subreddits_created: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "Subreddit"
      },
      subreddits_joined: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "Subreddit"
      }
   },
   { timestamps: true }
);

//* Middleware
userSchema.pre("remove", async function (next) {
   await Subreddit.updateOne({ followers: this._id }, {
      $pull: { followers: this._id },
      $inc: { followers_number: -1 }
   });
   await Subreddit.updateOne({ join_requests: this._id }, { $pull: { join_requests: this._id } });
   next();
});

//* static login method
userSchema.statics.login = async function (emailID, password) {
   if (!emailID || !password) {
      throw Error("All fields must be filled");
   }
   const user = await this.findOne({ emailID }).populate("followers", "username").populate({
      path: "saved_posts",
      populate: { path: "subreddit", select: "name" }
   }).populate({
      path: "posts",
      populate: { path: "subreddit", select: "name" }
   }).populate("subreddits_created");
   if (!user) {
      throw Error("User does not exist"); // Change to "Invalid Credentials" in final make. Security reasons.
   }

   const match = await bcrypt.compare(password, user.password);

   if (!match) {
      throw Error("Invalid Credentials"); // Instead of "invalid password". Security reasons
   }

   return user;
};

//* static signup method
userSchema.statics.signup = async function (
   fname,
   lname,
   username,
   age,
   emailID,
   password
) {
   // Will include in final
   // if (!validator.isStrongPassword(password)) {
   //   throw Error("Please enter a stronger password");
   // }

   const userExists = await this.findOne({ emailID });
   if (userExists) {
      throw Error("Email ID already exists");
   }

   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt);

   const user = await this.create({
      fname,
      lname,
      username,
      age,
      emailID,
      password: hash,
   });
   return user;
};

module.exports = mongoose.model("User", userSchema);
