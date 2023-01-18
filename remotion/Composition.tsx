import Script from "next/script";
import { Sequence, useVideoConfig } from "remotion";
import { SceneData } from "../pages/api/fetch-scenes";
import { RegularScene } from "./Scenes/RegularScene";

export const MainVideo: React.FC<{ data: SceneData[] }> = ({ data }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" />{" "}
      {/* Tailwind CDN added for TW CSS classes provided as data strings after compilation*/}
      {data.map((scene, index) => (
        <Sequence
          key={index}
          durationInFrames={scene.durationInSeconds * fps}
          from={scene.startFrom * fps}
          name={scene.name}
        >
          <RegularScene {...scene} />
        </Sequence>
      ))}
    </>
  );
};
