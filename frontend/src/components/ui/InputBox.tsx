import clsx from "clsx";
import { HTMLInputTypeAttribute, useState } from "react";

interface InputBoxProps {
  name: string;
  type: HTMLInputTypeAttribute;
  id?: string;
  placeholder?: string;
  value?: string;
  icon?: string;
}

const InputBox = ({
  name,
  type,
  id,
  placeholder,
  value,
  icon,
}: InputBoxProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        name={name}
        type={type == "password" && passwordVisible ? "text" : type}
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        className="input-box"
      />
      {icon && <i className={clsx("fi", icon, "input-icon")}></i>}
      {type == "password" && (
        <i
          className="fi fi-rr-eye-crossed input-icon left-auto right-4"
          onClick={() => setPasswordVisible((currentValue) => !currentValue)}
        ></i>
      )}
    </div>
  );
};

export default InputBox;
