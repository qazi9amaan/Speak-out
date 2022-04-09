const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone: { type: String, required: true },
    name: { type: String, required: false },
    avatar: {
      type: String,
      required: false,
      get: (avatar) => {
        if (avatar) return `${process.env.BASE_URL}${avatar}`;
        return null;
      },
    },
    activated: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model("User", userSchema, "users");
