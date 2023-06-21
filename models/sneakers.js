const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sneakersSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Sneakers", sneakersSchema);
