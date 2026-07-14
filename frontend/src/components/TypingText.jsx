import React from "react";
import { ReactTyped } from "react-typed";

const TypingText = ({
  strings = [
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
  ],
  className = "",
}) => {
  return (
    <ReactTyped
      className={className}
      strings={strings}
      typeSpeed={50}
      backSpeed={30}
      loop
    />
  );
};

export default TypingText;