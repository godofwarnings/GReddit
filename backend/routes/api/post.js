const express = require("express");
const router = express.Router();
const {
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
  savedPost
} = require("../../controller/postController");
const auth_middleware = require("../../middleware/requireAuth");
//* @route:
//* @access:
//* @desc:

//* @route:  GET /api/post/all
//* @access: PUBLIC
//* @desc:   gets all existing posts
router.get("/all", getPosts);

//* @route:  GET/api/post/single/:id
//* @access: PUBLIC
//* @desc:   gets a single post
router.get("/single/:id", getPost);

//* @route:  GET /api/post/save/:id
//* @access: PRIVATE
//* @desc:   save the post
router.get("/save/:id", auth_middleware, savePost);

//* @route:  GET /api/post/saved
//* @access: PRIVATE
//* @desc:   gets all the posts saved by the user
router.get("/saved", auth_middleware, savedPost);

//* @route:  GET /api/post/author/:emailID
//* @access: PUBLIC
//* @desc:   gets all posts of a particular author
router.get("/author/:emailID", getAuthorPost);

//* @route:  POST /api/post/create
//* @access: PRIVATE
//* @desc:   create a new post
router.post("/create", auth_middleware, createPost);

//* @route:  DELETE /api/post/delete/:id
//* @access: PRIVATE
//* @desc:   only the creator of the post or moderator of a subreddit can delete the post
router.delete("/delete/:id", auth_middleware, deletePost);

//* @route:  PUT /api/post/upvote/:id
//* @access: PRIVATE
//* @desc:   upvote a post or remove the upvote
router.get("/upvote/:id", auth_middleware, upvotePost);

//* @route:  PUT /api/post/downvote/:id
//* @access: PRIVATE
//* @desc:   downvote a post or remove the upvote
router.get("/downvote/:id", auth_middleware, downvotePost);

//* @route:
//* @access:
//* @desc:
router.post("/update/:id", updatePost);

//* @route:  POST /api/post/comment/:id
//* @access: PRIVATE
//* @desc:   add a comment on a post
router.post("/comment/:id", auth_middleware, commentAddPost);

//* @route:  DELETE /api/post/comment_delete/:id/:comment_id
//* @access: PRIVATE
//* @desc:   delete a comment from a post
router.delete("/comment_delete/:id/:comment_id", auth_middleware, commentDeletePost);

module.exports = router;
