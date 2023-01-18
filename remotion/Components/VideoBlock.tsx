import cn from "clsx";
import React from "react";
import { OffthreadVideo } from "remotion";

export const VideoBlock: React.FC<{
  src: string;
  mediaStyle?: string;
  volume?: number;
}> = ({ src, mediaStyle, volume }) => {
  return (
    <>
      {/* <Video src={staticFile('vidtest.mp4')} className="absolute w-full" /> */}
      <OffthreadVideo
        src={src}
        className={cn("absolute", mediaStyle ? mediaStyle : "w-full")}
        volume={volume}
      />
    </>
  );
};
