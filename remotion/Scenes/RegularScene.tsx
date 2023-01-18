import cn from "clsx";
import React from "react";
import { Audio } from "remotion";
import { Image } from "../Components/Image";
import { Text } from "../Components/Text";
import { VideoBlock } from "../Components/VideoBlock";

import { SceneData } from "../../pages/api/fetch-scenes";

import { Animated } from "remotion-animated";
import stringToReAnimated from "../../utils/stringToReAnimated";

export const RegularScene: React.FC<SceneData> = ({
  text,
  media,
  textStyle,
  mediaStyle,
  bgStyle,
  animation,
  volume,
}) => {
  const image = media?.[0]?.type?.startsWith("image") ? media[0] : null;
  const video = media?.[0]?.type?.startsWith("video") ? media[0] : null;
  const sound = media?.[0]?.type?.startsWith("audio") ? media[0] : null;

  return (
    <>
      <Animated
        className={cn(
          "items-center justify-center",
          "absolute inset-0 flex h-full w-full flex-col",
          bgStyle ? bgStyle : ""
        )}
        animations={stringToReAnimated(animation || [])}
      >
        {video && (
          <VideoBlock src={video.url} mediaStyle={mediaStyle} volume={volume} />
        )}
        {image && <Image src={image.url} mediaStyle={mediaStyle} />}
        {!!text && <Text text={text} textStyle={textStyle} />}
      </Animated>
      {sound && <Audio src={sound.url} volume={volume} />}
    </>
  );
};
