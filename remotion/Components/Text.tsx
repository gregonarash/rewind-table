import cn from "clsx";
import React from "react";

export const Text: React.FC<{ text?: string; textStyle?: string }> = ({
  text,
  textStyle,
}) => {
  return (
    <>
      <div
        className={cn(
          "absolute",
          textStyle
            ? textStyle
            : "max-w-lg scale-150 text-center text-6xl font-bold text-gray-900"
        )}
      >
        {text}
      </div>
    </>
  );
};
