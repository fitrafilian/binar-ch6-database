const mongoose = require("mongoose");

// Connect database
mongoose.connect(
  "mongodb+srv://3filian:admin@cluster0.jfidc.mongodb.net/binar?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);
