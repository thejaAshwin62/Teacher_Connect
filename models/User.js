import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "teacher"],
    default: "user",
  },
  profilePic: {
    type: String,
    default: "",
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

mongoose.connection.collections.users?.dropIndex('name_1');

export const User = mongoose.model("User", UserSchema);

