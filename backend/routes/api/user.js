const express = require("express");
const router = express.Router();
const auth_middleware = require("../../middleware/requireAuth");

const {
   loginUser,
   signupUser,
   getUsers,
   getUser,
   deleteUser, removeFollowerUser, removeFollowingUser, followUser
} = require("../../controller/userController");

router.get("/all", getUsers);
router.get("/u", auth_middleware, getUser);

router.post("/login", loginUser);

router.get("/remove_follower/:id", auth_middleware, removeFollowerUser)
router.get("/remove_following/:id", auth_middleware, removeFollowingUser)
router.get("/follow/:id", auth_middleware, followUser)

router.post("/signup", signupUser);

router.delete("/delete/:id", auth_middleware, deleteUser);

module.exports = router;
