import mongoose, { Schema, Document, Model } from "mongoose";

// Interface định nghĩa kiểu dữ liệu của Comment
interface IComment extends Document {
  blog_id: mongoose.Types.ObjectId;
  blog_author: mongoose.Types.ObjectId;
  comment: string;
  children?: mongoose.Types.ObjectId[];
  commented_by: mongoose.Types.ObjectId;
  isReply?: boolean;
  parent?: mongoose.Types.ObjectId;
  commentedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },
    blog_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },
    comment: {
      type: String,
      required: true,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    commented_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    isReply: {
      type: Boolean,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

const CommentModel: Model<IComment> = mongoose.model<IComment>(
  "comments",
  commentSchema
);
export default CommentModel;
