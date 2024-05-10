const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    reporting_user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reported_user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    concern: {
      type: String,
      required: true,
    },
    associated_post: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Post",
    },
    associated_subreddit: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Subreddit",
    },
    status: {
      type: String,
      required: false,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
