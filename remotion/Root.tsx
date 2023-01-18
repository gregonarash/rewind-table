import { useCallback, useEffect, useState } from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { AirtableDataHash } from "../components/PlayerSection";
import { SceneData, fetchScenes } from "../pages/api/fetch-scenes";
import "../styles/globals.css";
import { MainVideo } from "./Composition";
import { Placeholder } from "./Placeholder";

export const RemotionRoot: React.FC = () => {
  const [data, setData] = useState<SceneData[]>([]);
  const [duration, setDuration] = useState(60);
  const [handle] = useState(() => delayRender());
  const [hash, setHash] = useState<string | null>(
    window.location.hash.slice(1)
  );

  if (!hash) {
    continueRender(handle);
    return (
      <Composition
        id="Placeholder"
        component={Placeholder}
        durationInFrames={24 * 10}
        fps={24}
        height={1080}
        width={1080}
      />
    );
  }

  function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)));
  }
  const decodedString = b64_to_utf8(hash);

  const { sceneRequest, sceneProperties } = JSON.parse(
    decodedString
  ) as AirtableDataHash;

  const { height, width, fps = 24 } = sceneProperties;

  const fetchData = useCallback(async () => {
    const [data, duration] = await fetchScenes(sceneRequest);
    setData(data);
    setDuration(duration);
    console.log(data);
    continueRender(handle);
  }, [handle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // This is to make sure the data is re-fetched when the tab is focused
  useEffect(() => {
    addEventListener("focus", (event) => {
      fetchData();
    });
  }, []);

  // so that reload doesn't break the data link (hash)
  useEffect(() => {
    window.location.hash = hash;
  });

  return (
    <Composition
      id="MainVideo"
      component={MainVideo}
      durationInFrames={fps * duration}
      fps={fps}
      height={height}
      width={width}
      defaultProps={{
        data,
      }}
    />
  );
};
