const userModel = (mongoose) => {
  const { Schema, model } = mongoose;

  const usersSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "agent"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    active: {
      type: Boolean,
      default: true,
    },
  });

  return model("users", usersSchema);
};

module.exports = userModel;
