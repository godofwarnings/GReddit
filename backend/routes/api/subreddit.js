const express = require("express");
const router = express.Router();
const {
   createSubreddit,
   getSubreddits,
   deleteSubreddit,
   getSubreddit,
   joinRequestSubreddit,
   handleRequestSubreddit,
   leaveSubreddit
} = require("../../controller/subredditController");
const auth_middleware = require("../../middleware/requireAuth");
//* @route:
//* @access:
//* @desc:

router.get('/g/request/:name/:id/:action', auth_middleware, handleRequestSubreddit)

//* @route:  /api/subreddit/g/request/:name
//* @access: PRIVATE
//* @desc:   request to join a subreddit
router.get("/g/request/:name", auth_middleware, joinRequestSubreddit);

//* @route:  /api/subreddit/g/leave/:name
//* @access: PRIVATE
//* @desc:   request to join a subreddit
router.get("/g/leave/:name", auth_middleware, leaveSubreddit);

//* @route:  /api/subreddit/all
//* @access: PUBLIC
//* @desc:   get all subreddits
router.get("/all", getSubreddits);

//* @route:  /api/subreddit
//* @access: PUBLIC
//* @desc:   get a single subreddit
router.get("/g/:name", getSubreddit);

//* @route:  /api/subreddit/create
//* @access: PRIVATE
//* @desc:   create a subreddit
router.post("/create", auth_middleware, createSubreddit);

//* @route:  DELETE /api/subreddits/delete/:name
//* @access: private
//* @desc:   only the creator of the subreddit can delete it
router.delete("/delete/g/:name", auth_middleware, deleteSubreddit);

module.exports = router;
