const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");
const Subreddit = require("./subredditModel");
var ObjectID = require("mongodb").ObjectId;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    subreddit: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Subreddit",
    },
    upvotes: {
      type: Number,
      default: 1,
      required: false,
    },
    downvotes: {
      type: Number,
      default: 0,
      required: false,
    },
    upvotedBy: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: "User",
    },
    downvotedBy: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: "User",
    },
    comments: [
      {
        author: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
          required: false,
        },
        text: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("remove", async function (next) {
  console.log(this._id, this.author);
  await User.updateOne({ _id: this.author }, { $pull: { posts: this._id } });
  await User.updateMany(
    { saved_posts: this._id },
    { $pull: { saved_posts: this._id } }
  );
  await Subreddit.updateOne(
    { _id: ObjectID(this.subreddit) },
    { $pull: { posts: this._id }, $inc: { posts_number: -1 } }
  );
  next();
});

module.exports = mongoose.model("Post", postSchema);
