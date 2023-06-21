const express = require("express");
const sneakersRouter = express.Router();
const Sneakers = require("../models/sneakers.js");
const { expressjwt: jwt } = require("express-jwt");
const Comment = require("../models/comment.js");

// Get all sneakers
sneakersRouter.route("/").get((req, res, next) => {
  Sneakers.find()
    .then((sneakers) => {
      return res.status(200).send(sneakers);
    })
    .catch((err) => {
      res.status(500);
      return next(err);
    });
});

//// Get sneaker by userId
sneakersRouter.get(
  "/user",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  (req, res, next) => {
    Sneakers.find({ user: req.auth._id })
      .then((sneakers) => {
        return res.status(200).send(sneakers);
      })
      .catch((err) => {
        res.status(500);
        return next(err);
      });
  }
);
// Post sneaker
sneakersRouter.post(
  "/",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  (req, res, next) => {
    req.body.user = req.auth._id;
    const newSneakers = new Sneakers({
      title: req.body.title,
      img: req.body.img,
      description: req.body.description,
      user: req.body.user,
      likes: [],
      comment: [],
    });

    newSneakers
      .save()
      .then((savedSneakers) => {
        return res.status(201).send(savedSneakers);
      })
      .catch((err) => {
        res.status(500);
        return next(err);
      });
  }
);
// Delete sneaker
sneakersRouter.delete(
  "/:sneakersId",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  (req, res, next) => {
    Sneakers.findOneAndDelete({
      _id: req.params.sneakersId,
      user: req.auth._id,
    })

      .then((deletedSneaker) => {
        return res
          .status(200)
          .send(
            `Successfully deleted ${deletedSneaker.title} from the database`
          );
      })
      .catch((err) => {
        res.status(500);
        return next(err);
      });
  }
);
//edit sneaker
sneakersRouter.put(
  "/:sneakersId",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  (req, res, next) => {
    Sneakers.findOneAndUpdate(
      { _id: req.params.sneakersId, user: req.auth._id },
      req.body,
      { new: true }
    )
      .then((updatedSneakers) => {
        return res.status(201).send(updatedSneakers);
      })
      .catch((err) => {
        res.status(500);
        return next(err);
      });
  }
);
//like sneaker
sneakersRouter.put(
  "/like/:id",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res) => {
    try {
      const sneaker = await Sneakers.findById(req.params.id);
      const userId = req.auth._id;
      const username = req.auth.username;
      console.log(username);
      if (!sneaker) {
        return res.status(404).json({ msg: "Sneaker not found" });
      }
      if (sneaker.likes.some((like) => like.user.toString() === userId)) {
        return res.status(400).json({ msg: "Sneaker already liked" });
      }
      sneaker.likes.push({ user: userId, username: username });
      await sneaker.save();
      res.json(sneaker.likes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
//dislike sneaker
sneakersRouter.put(
  "/unlike/:id",
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res) => {
    try {
      const sneaker = await Sneakers.findById(req.params.id);
      const userId = req.auth._id;
      if (
        sneaker.likes.filter((like) => like.user.toString() === userId)
          .length === 0
      ) {
        return res.status(400).json({ msg: "Sneaker has not yet been liked" });
      }
      const removeIndex = sneaker.likes
        .map((like) => like.user.toString())
        .indexOf(userId);
      sneaker.likes.splice(removeIndex, 1);
      await sneaker.save();
      res.json(sneaker.likes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
module.exports = sneakersRouter;
