const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const History = mongoose.model("history", {
  date: {
    type: Date,
    required: true,
  },
  player: {
    type: Number,
    required: true,
  },
  computer: {
    type: Number,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },

  idUser: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = { History };
