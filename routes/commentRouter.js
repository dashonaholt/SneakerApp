const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const commentRouter = express.Router();
const Comment = require("../models/comment.js");
const User = require("../models/user.js");

// Get all comments
commentRouter.get("/", async (req, res, next) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "username",
    });
    return res.status(200).send(comments);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});
// Get comments by comment id
commentRouter.get("/:commentId", async (req, res, next) => {
  console.log(req.params.commentId);
  try {
    const comments = await Comment.find({ sneaker: req.params.commentId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "username",
      });
    console.log(comments);
    return res.status(200).send(comments);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});
//post comments
commentRouter.post(
  "/:commentId",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      req.body.user = req.auth._id;
      req.body.sneaker = req.params.commentId;
      req.body.username = req.auth.username;
      const newComment = new Comment(req.body);
      const savedComment = await newComment.save();
      console.log(savedComment);
      return res.status(201).send(savedComment);
    } catch (err) {
      res.status(500);
      return next(err);
    }
  }
);
//edit comments
commentRouter.put(
  "/:commentId",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  (req, res, next) => {
    Comment.findOneAndUpdate({ _id: req.params.commentId }, req.body, {
      new: true,
    })
      .then((updatedComment) => {
        return res.status(201).send(updatedComment);
      })
      .catch((err) => {
        res.status(500);
        return next(err);
      });
  }
);
//delete comments
commentRouter.delete(
  "/:commentId",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      const deletedComment = await Comment.findOneAndDelete({
        _id: req.params.commentId,
      });
      if (!deletedComment) {
        res.status(404).send("Not found");
      }
      res.status(200).send(`${deletedComment.content} was deleted`);
    } catch (err) {
      res.status(500);
      return next(err);
    }
  }
);

module.exports = commentRouter;
