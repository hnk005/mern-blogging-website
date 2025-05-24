import { uploadImg } from "@/services/cloudinary";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";

const uploadImageByUrl = (e: any) => {
  const link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch {
      reject(e);
    }
  });

  return link.then((url) => ({
    success: 1,
    file: { url },
  }));
};

const uploadImageByFile = (e: any) => {
  return uploadImg(e).then((url) => {
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  });
};

const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: Quote,
  marker: Marker,
  inlineCode: InlineCode,
};

export default tools;
