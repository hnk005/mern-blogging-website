// src/components/ui/loaders/PageLoader.tsx
import useSizeIconLoader from "@/hooks/useSizeIconLoader";
import { RingLoader } from "react-spinners";

const PageLoader = () => {
  const size = useSizeIconLoader();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <RingLoader color="#242424" size={size} />
    </div>
  );
};

export default PageLoader;
