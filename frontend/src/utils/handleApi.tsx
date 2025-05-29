import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";
import { IBackendRes } from "@/types/backend.type";

type RequestOptions<T> = {
  fetch: () => Promise<AxiosResponse<T>>;
  show?: () => void;
  hide?: () => void;
};

export const handleApiRequest = async <T,>({
  fetch,
  show,
  hide,
}: RequestOptions<IBackendRes<T>>): Promise<IBackendRes<T> | undefined> => {
  try {
    show?.();

    const res = await fetch();
    if (!res.data) {
      throw res.data;
    }

    toast.success(res.data.message || "Successfully!");
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const res = error.response?.data as IBackendRes<T>;
      const msg =
        Array.isArray(res?.error) && res.error.length > 0
          ? res.error.join("\n")
          : res.message || error.message;
      toast.error(msg);
    } else {
      console.error(error);
      toast.error("Internal server error!");
    }
  } finally {
    hide?.();
  }
};
