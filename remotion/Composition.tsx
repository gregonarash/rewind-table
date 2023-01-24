import Script from "next/script";
import { Sequence, useVideoConfig } from "remotion";
import { SceneData } from "../pages/api/fetch-scenes";
import { RegularScene } from "./Scenes/RegularScene";

declare global {
  interface Window {
    tailwind: any;
  }
}

export const MainVideo: React.FC<{ data: SceneData[] }> = ({ data }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {/* Tailwind CDN added for TW CSS classes provided as data strings after compilation*/}
      <Script
        src="https://cdn.tailwindcss.com"
        onLoad={() => {
          window.tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['"Noto Sans"', '"Noto Color Emoji"'],
                },
              },
            },
          };
        }}
      />

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
