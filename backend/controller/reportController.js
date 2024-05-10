const mongoose = require("mongoose");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Subreddit = require("../models/subredditModel");
const Report = require("../models/reportModel");
const lodash = require("lodash");
const { populate } = require("../models/postModel");

const createReport = async (req, res) => {
  const { post_id } = req.params;
  console.log(req.body);
  const { concern } = req.body;
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const subreddit = await Subreddit.findById(post.subreddit);

    const report = await Report.create({
      reporting_user: req.user._id,
      reported_user: post.author,
      concern,
      associated_subreddit: post.subreddit,
      associated_post: post_id,
    });
    console.log(">>> REPORT created", report);
    //Push the report to the subreddit model
    subreddit.reports.push(report._id);
    await subreddit.save();
    res.status(200).json({ report });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const blockUserReport = async (req, res) => {
  const { report_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(report_id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const report = await Report.findById(report_id);
    const post = await Post.findById(report.associated_post);
    const subreddit = await Subreddit.findById(report.associated_subreddit);
    if (!subreddit.creator.equals(req.user._id)) {
      return res.status(401).json({ message: "User not authorized" });
    }
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    if (!post) {
      subreddit.reports = subreddit.reports.filter(
        (report) => !report._id.equals(report_id)
      );
      await subreddit.save();
      await report.remove();
      return res.status(404).json({ error: "Post not found" });
    }
    if (subreddit.creator.equals(req.user._id)) {
      if(report.reported_user.equals(req.user._id)){
        res.status(200).json({ message: "cannot block the moderator of the sub itself" });
      }
      report.status = "blocked";
      post.username = "Blocked User";
      if (
        !subreddit.blocked_users.find((u) => u.equals(report.reported_user))
      ) {
        subreddit.blocked_users.push(report.reported_user);
        subreddit.followers_number -= 1;
        subreddit.followers = subreddit.followers.filter(
          (follower) => !follower.equals(report.reported_user)
        );
        await report.save();
        await post.save();
        await subreddit.save();
        res.status(200).json({ message: "User blocked" });
      } else {
        await report.save();
        await post.save();
        res.status(200).json({ message: "User already blocked" });
      }
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePostReport = async (req, res) => {
  const { report_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(report_id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const report = await Report.findById(report_id);
    const post = await Post.findById(report.associated_post);
    const subreddit = await Subreddit.findById(report.associated_subreddit);
    if (!subreddit.creator.equals(req.user._id)) {
      return res.status(401).json({ message: "User not authorized" });
    }
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    if (!post) {
      subreddit.reports = subreddit.reports.filter(
        (report) => !report._id.equals(report_id)
      );
      await subreddit.save();
      await report.remove();
      return res.status(200).json({ error: "Post not found" });
    }
    if (subreddit.creator.equals(req.user._id)) {
      subreddit.reports = subreddit.reports.filter(
        (report) => !report._id.equals(report_id)
      );
      await subreddit.save();
      await report.remove();
      await post.remove();
      res.status(200).json({ message: "Report Processed and deleted" });
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const ignoreReport = async (req, res) => {
  const { report_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(report_id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const report = await Report.findById(report_id);
    const post = await Post.findById(report.associated_post);
    const subreddit = await Subreddit.findById(report.associated_subreddit);
    if (!subreddit.creator.equals(req.user._id)) {
      return res.status(401).json({ message: "User not authorized" });
    }
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    if (!post) {
      subreddit.reports = subreddit.reports.filter(
        (report) => !report._id.equals(report_id)
      );
      await subreddit.save();
      await report.remove();
      return res.status(404).json({ error: "Post not found" });
    }

    if (subreddit.creator.equals(req.user._id)) {
      report.status = "ignored";
      await report.save();
      res.status(200).json({ message: "Report ignored" });
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createReport,
  blockUserReport,
  deletePostReport,
  ignoreReport,
};
