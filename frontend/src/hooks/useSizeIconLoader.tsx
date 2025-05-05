import { useEffect, useState } from "react";

const useSizeIconLoader = () => {
  const [size, setSize] = useState(100);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSize(60);
      } else if (width < 1024) {
        setSize(80);
      } else {
        setSize(100);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

export default useSizeIconLoader;
