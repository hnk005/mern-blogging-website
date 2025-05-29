import mongoose, { Schema, Document, Model } from "mongoose";

const profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];

const profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

export interface IUser extends Document {
  personal_info: {
    fullname: string;
    email: string;
    password?: string;
    username: string;
    bio?: string;
    profile_img?: string;
  };
  social_links: {
    youtube: string;
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    website: string;
  };
  blogs: mongoose.Types.ObjectId[];
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  google_auth: boolean;
  joinedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, "fullname must be at least 3 letters long"],
        maxlength: [50, "fullname must be at most 50 letters long"],
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      password: {
        type: String,
      },
      username: {
        type: String,
        minlength: [3, "Username must be at least 3 letters long"],
        unique: true,
        required: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not  be at most more than 200"],
      },
      profile_img: {
        type: String,
        default: () => {
          const collection =
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ];
          const name =
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ];
          return `https://api.dicebear.com/6.x/${collection}/svg?seed=${name}`;
        },
      },
    },
    social_links: {
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    account_info: {
      total_posts: { type: Number, default: 0 },
      total_reads: { type: Number, default: 0 },
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("users", userSchema);
export default UserModel;
