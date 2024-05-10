const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subredditSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         unique: true,
      },
      description: {
         type: String,
         required: true,
      },
      creator: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: "User",
      },
      moderator: {
         type: [Schema.Types.ObjectId],
         required: true,
      },
      tags: {
         type: [String],
         required: false,
      },
      banned_keywords: {
         type: [String],
         required: false,
      },
      followers_number: {
         type: Number,
         required: false,
         default: 1,
      },
      followers: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "User",
      },
      posts_number: {
         type: Number,
         required: false,
         default: 0,
      },
      posts: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "Post",
      },
      blocked_users: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "User",
      },
      reports: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "Report",
      },
      join_requests: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "User"
      },
      rejected_requests: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "User"
      },
      left_users: {
         type: [Schema.Types.ObjectId],
         required: false,
         ref: "User",
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Subreddit", subredditSchema);
