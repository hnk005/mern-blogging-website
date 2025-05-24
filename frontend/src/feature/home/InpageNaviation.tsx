import {
  useRef,
  useState,
  useLayoutEffect,
  PropsWithChildren,
  useEffect,
} from "react";
import { motion } from "framer-motion";

interface InpageNaviationProps extends PropsWithChildren {
  routes: string[];
  defaultHidden: string;
  defaultActive?: number;
}

const InpageNaviation = ({
  routes,
  defaultHidden,
  defaultActive = 0,
  children,
}: InpageNaviationProps) => {
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActive);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const currentTab = tabRefs.current[inPageNavIndex];
    if (currentTab) {
      setUnderlineStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [inPageNavIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = () => {
      if (mediaQuery.matches) {
        setInPageNavIndex(0);
      }
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`relative p-4 px-5 capitalize whitespace-nowrap ${
              inPageNavIndex === index ? "text-black" : "text-dark-grey"
            } ${route.includes(defaultHidden) ? "md:hidden" : ""}`}
            onClick={() => setInPageNavIndex(index)}
          >
            {route}
          </button>
        ))}

        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 h-[2px] bg-black"
          animate={underlineStyle}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InpageNaviation;
