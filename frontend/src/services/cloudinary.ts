import axios from "axios";

export const uploadImg = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

  const res = await axios.post(
    `${import.meta.env.VITE_CLOUDINARY_API_URL}/image/upload`,
    formData
  );
  return res.data.secure_url;
};
