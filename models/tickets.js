const ticketsModel = (mongoose) => {
  const { Schema, model } = mongoose;
  const ticketSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    tag: {
      type: String,
      required: true,
    },

    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        comment: { type: String },
        senderType: {
          type: String,
          default: "agent",
          enum: ["agent", "admin", "user"],
        },
      },
    ],
  });

  return model("tickets", ticketSchema);
};

module.exports = ticketsModel;
