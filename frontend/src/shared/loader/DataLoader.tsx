import { ClipLoader } from "react-spinners";

type Position = "top" | "center" | "bottom";

const positionClassMap: Record<Position, string> = {
  top: "justify-center items-start",
  center: "justify-center items-center",
  bottom: "justify-center items-end",
};

const DataLoader = ({
  size = 20,
  color = "#242424",
  className = "",
  position = "center" as Position,
}: {
  size?: number;
  color?: string;
  className?: string;
  position?: Position;
}) => {
  return (
    <div
      className={`flex w-full h-full ${positionClassMap[position]} ${className}`}
    >
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default DataLoader;
