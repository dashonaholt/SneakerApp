const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sneaker: {
    type: Schema.Types.ObjectId,
    ref: "Sneaker",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
