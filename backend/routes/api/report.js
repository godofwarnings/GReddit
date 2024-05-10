const express = require("express");
const router = express.Router();
const auth_middleware = require("../../middleware/requireAuth");
const {
  createReport,
  blockUserReport,
  deletePostReport,
  ignoreReport,
} = require("../../controller/reportController");

//* @route:  /api/report/create/:post_id
//* @access: PRIVATE
//* @desc:   Create a new report
router.post("/create/:post_id", auth_middleware, createReport);

//* @route:  /api/report/block_user/:report_id
//* @access: PRIVATE
//* @desc:   Block user
router.get("/block_user/:report_id", auth_middleware, blockUserReport);

//* @route:  /api/report/ignore/:report_id
//* @access: PRIVATE
//* @desc:   Ignore report
router.get("/ignore/:report_id", auth_middleware, ignoreReport);

//* @route:  /api/report/delete/:report_id
//* @access: PRIVATE
//* @desc:   delete a post
router.delete("/delete/:report_id", auth_middleware, deletePostReport);

module.exports = router;
