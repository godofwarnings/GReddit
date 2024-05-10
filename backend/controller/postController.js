const mongoose = require("mongoose");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Subreddit = require("../models/subredditModel");

// @status:
// @params_required:
// @body:

//* @status: completed
//* @param : {post_id}
//* @body: {}
const savePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post Does not exist" });
    }

    const user = await User.findById(req.user._id);

    if (user.saved_posts.filter((post) => post.equals(id)).length > 0) {
      await user.update({ $pull: { saved_posts: id } });
      await user.save();
      return res.status(200).json({ message: "Post unsaved", saved: false });
    } else {
      user.saved_posts.push(id);
      await user.save();
      res.status(200).json({
        saved: true,
        message: "Post saved successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//* @status: completed
//* @param : {}
//* @body: {}
const savedPost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("saved_posts");

    if (user.saved_posts.length > 0) {
      user.saved_posts.forEach(async (id) => {
        const post = await Post.findById(id);
        console.log(post);
        if (!post) {
          user.saved_posts = user.saved_posts.filter(
            (post_) => !post_.equals(id),
            await user.save()
          );
        }
      });
    } else {
      res.status(200).json({ message: "No saved posts found" });
    }

    if (user.saved_posts.length > 0) {
      await user.populate({
        path: "saved_posts",
        populate: { path: "subreddit", select: "name" },
      });
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
//? Figure out why even though objects are pushed, the array is empty. Answer: async function...
const savedPost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    let savedPosts = ["Hello"];
    let tata = [];
    if (user.saved_posts.length > 0) {
      //! THIS IS A PITFALL. The callback inside map is asynchronous and therefore when it comes out, we didnt wait before returning the response objct
      await Promise.all(
        user.saved_posts.map(async (id) => {
          const post = await Post.findById(id);
          if (!post) {
            user.saved_posts = user.saved_posts.filter(
              (post_) => !post_.equals(id)
            );
            await user.save();
          }
          await post.populate("subreddit", "name");
          savedPosts.push(post);
        })
      );
      return res.status(200).json({ savedPosts, tata });
    }
    res.status(200).json({ message: "No saved posts" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/

//* @status: completed
//* @params_required: {}
//* @body: {title, text, subreddit.name}
//? the author is upvoter by default.
const createPost = async (req, res) => {
  const { title, text, subreddit } = req.body;
  try {
    const subreddit_id = await Subreddit.findOne({ name: subreddit }); // We only want the subreddit ID
    if (
      subreddit_id.followers.find((follower) => follower.equals(req.user._id))
    ) {
      const auth = await User.findById(req.user._id);
      const post = await Post.create({
        title,
        text,
        author: auth._id,
        username: auth.username,
        upvotedBy: auth._id,
        subreddit: subreddit_id._id,
      });
      //Push the post to the subreddit model and increase number of posts
      await subreddit_id.updateOne({
        posts_number: subreddit_id.posts_number + 1,
      });
      subreddit_id.posts.push(post._id);
      await subreddit_id.save();

      //Push the post to the user model
      auth.posts.push(post._id);
      await auth.save();
      await post.populate("subreddit", "name");
      res.status(200).json({ post });
    }
    else {
    res.status(400).json({ error: "You cannot post in a subreddit which you are not a member of" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//* @status: completed
//* @params_required: {emailID}
//* @body: {}
const getAuthorPost = async (req, res) => {
  const { emailID } = req.params;
  try {
    const posts = await User.findOne({ emailID })
      .populate({
        path: "posts",
        populate: { path: "subreddit", select: "name" },
      })
      .select("posts");
    if (!posts) {
      return res.status(404).json({ error: "User not found" });
    }
    if (posts.posts.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//* @status: completed
//* @params_required: {post._id}
//* @body: {}
const getPost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.populate("subreddit", "name");
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//* @status: completed
//* @params_required: {}
//* @body: {}
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "subreddit", select: "name" });
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//* @status: completed
//* @params_required: {post._id}
//* @body: {}
const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(id);
    console.log(post);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const subreddit = await Subreddit.findOne({ _id: post.subreddit });
    if (
      post.author.equals(req.user._id) ||
      subreddit.creator.equals(req.user._id)
    ) {
      await post.remove();
      res.status(200).json({ message: "Post removed successfully" });
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//* @status: completed
//* @params_required: {post._id}
//* @body: {}
const upvotePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // check if post is already upvoted by the user
    if (post.upvotedBy.filter((user) => user.equals(req.user._id)).length > 0) {
      post.upvotes = post.upvotes - 1;
      post.upvotedBy = post.upvotedBy.filter(
        (user) => !user.equals(req.user._id)
      );
      await post.save();
      const netVotes = post.upvotes - post.downvotes;
      return res.status(200).json({
        message: "Upvote removed",
        upvote: false,
        voteCount: netVotes,
      });
    }
    // check if post is already downvoted by the user
    else if (
      post.downvotedBy.filter((user) => user.equals(req.user._id)).length > 0
    ) {
      post.downvotes = post.downvotes - 1;
      post.downvotedBy = post.downvotedBy.filter(
        (user) => !user.equals(req.user._id)
      );
      await post.save();
    }
    post.upvotedBy.push(req.user._id);
    post.upvotes = post.upvotes + 1;
    await post.save();
    const netVotes = post.upvotes - post.downvotes;
    res.json({
      message: "Post upvoted successfully",
      upvote: true,
      voteCount: netVotes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};

//* @status: completed
//* @params_required: {post._id}
//* @body: {}
const downvotePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // check if post is already downvoted by the user
    if (
      post.downvotedBy.filter((user) => user.equals(req.user._id)).length > 0
    ) {
      post.downvotes = post.downvotes - 1;
      post.downvotedBy = post.downvotedBy.filter(
        (user) => !user.equals(req.user._id)
      );
      await post.save();
      const netVotes = post.upvotes - post.downvotes;
      return res.status(200).json({
        message: "Downvote removed",
        downvote: false,
        voteCount: netVotes,
      });
    }
    // check if post is already upvoted by the user
    else if (
      post.upvotedBy.filter((user) => user.equals(req.user._id)).length > 0
    ) {
      post.upvotes = post.upvotes - 1;
      post.upvotedBy = post.upvotedBy.filter(
        (user) => !user.equals(req.user._id)
      );
      await post.save();
    }
    post.downvotedBy.push(req.user._id);
    post.downvotes = post.downvotes + 1;
    await post.save();
    const netVotes = post.upvotes - post.downvotes;
    res.json({
      message: "Post downvoted successfully",
      downvote: true,
      voteCount: netVotes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Server Error");
  }
};

//* @status: completed
//* @params_required: {post._id}
//* @body: {comment.text}
const commentAddPost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const user = await User.findById(req.user._id).select("-password");
    const { text } = req.body;
    const comment = {
      author: req.user._id,
      text,
      username: user.username,
    };
    post.comments.unshift(comment);
    await post.save();
    res.status(200).json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

//* @status: completed
//* @params_required: {post._id, comment._id}
//* @body: {comment.text}
const commentDeletePost = async (req, res) => {
  const { id, comment_id } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(comment_id)
  ) {
    return res.status(404).json({ error: "Invalid ID type" });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const subreddit = await Subreddit.findOne({ _id: post.subreddit });
    const comment = post.comments.find((comment) =>
      comment._id.equals(comment_id)
    );
    const user = await User.findById(req.user._id).select("-password");

    if (!comment) {
      return res.status(404).json({ error: "No comment found" });
    }

    // check if user is author of the post or the moderator of the sub
    if (
      comment.author.equals(req.user._id) ||
      subreddit.creator.equals(req.user._id)
    ) {
      post.comments = post.comments.filter(
        (comment) => !comment._id.equals(comment_id)
      );
      await post.save();
      res.json({
        message: "Comment removed successfully",
        comments: post.comments,
      });
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {};

module.exports = {
  createPost,
  getPost,
  getPosts,
  deletePost,
  updatePost,
  getAuthorPost,
  upvotePost,
  downvotePost,
  commentAddPost,
  commentDeletePost,
  savePost,
  savedPost,
};
