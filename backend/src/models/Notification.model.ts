import mongoose, { Schema, Document, Model } from "mongoose";

interface INotification extends Document {
  type: "like" | "comment" | "reply";
  blog: mongoose.Types.ObjectId;
  notification_for: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
  reply?: mongoose.Types.ObjectId;
  replied_on_comment?: mongoose.Types.ObjectId;
  seen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["like", "comment", "reply"],
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },
    notification_for: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    reply: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    replied_on_comment: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel: Model<INotification> = mongoose.model<INotification>(
  "notification",
  notificationSchema
);

export default NotificationModel;
