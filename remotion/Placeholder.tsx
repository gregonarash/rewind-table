import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneData } from "../pages/api/fetch-scenes";
export const Placeholder: React.FC<{ data: SceneData[] }> = ({ data }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 100,
        }}
        className="bg-blue-200"
      >
        Missing hash # in url <br />
        Frame number {frame}.
      </AbsoluteFill>
    </>
  );
};
