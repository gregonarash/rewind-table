import { useQuery } from "@tanstack/react-query";
import cn from "clsx";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Select from "react-select";
import { SceneData, ScenesRequestParams } from "../pages/api/fetch-scenes";
import { MainVideo } from "../remotion/Composition";

import { Button } from "./Button";
import { SelectOption } from "./FieldMapper";
import { GridPattern } from "./GridPattern";

import { Player } from "@remotion/player";
import { prefetch } from "remotion";

export type PlayerSectionProps = {
  fps?: number;
  width: number;
  height: number;
};

export type AirtableDataHash = {
  sceneRequest: ScenesRequestParams;
  sceneProperties: PlayerSectionProps;
  duration: number;
};

const PlayerSection = ({
  apiKey,
  baseId,
  table,
  view,
  fieldNames,
}: ScenesRequestParams) => {
  const [fps, setFps] = useState(24);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1920);

  const { data, error, refetch } = useQuery({
    queryKey: ["scenes", apiKey, baseId, table, view, fieldNames],
    queryFn: () =>
      fetch("/api/fetch-scenes", {
        method: "POST",
        body: JSON.stringify({ apiKey, baseId, table, view, fieldNames }),
      })
        .then((res) => res.json())
        .then((data) => data),
  });

  if (error) {
    console.log("Data Error", error);
    console.log("Data ", data);
    return <div>Something went wrong</div>;
  }
  if (!data) {
    return <div>Loading</div>;
  }

  const [scenes, duration]: [SceneData[], number] = data;

  scenes.forEach((scene) => {
    const { media } = scene;
    if (media?.[0]) {
      const { free, waitUntilDone } = prefetch(media?.[0].url, {
        method: "blob-url",
      });

      //TODO Properly resolve promises and show loading state
      waitUntilDone();
    }
  });

  const frameRatios: SelectOption[] = [
    { label: "YouTube Short", value: " 1080x1920" },
    { label: "IG 1080p", value: "1080x1080" },
    { label: "HD 1080p", value: "1920x1080" },
    { label: "HD 720p", value: "1280x720" },
  ];

  function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
      <div role="alert" className="rounded-lg bg-slate-100 p-3">
        <p>Something went wrong:</p>
        <p className=" text-red-6 00 p-2 font-semibold">{error.message}</p>
        <div className=" flex w-full justify-center">
          <Button
            onClick={resetErrorBoundary}
            className=" mt-5 "
            variant="outline"
            color="red"
          >
            Reload data
          </Button>
        </div>
      </div>
    );
  }

  function openPreview() {
    const sceneRequest = {
      apiKey,
      baseId,
      table,
      view,
      fieldNames,
    };
    const sceneProperties: PlayerSectionProps = { width, height, fps };
    //open new window while maintaining reference to it

    window.open(
      "http://localhost:3001#" +
        createHash({ sceneRequest, sceneProperties, duration }),
      "preview"
    );
    function utf8_to_b64(str: string) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
    function createHash({
      sceneRequest,
      sceneProperties,
      duration,
    }: AirtableDataHash) {
      return utf8_to_b64(
        JSON.stringify({ sceneRequest, sceneProperties, duration })
      );
    }
  }

  function openFeedbackForm() {
    window.open("https://airtable.com/shr274wwSarVLnBRM", "feedback");
  }

  return (
    <section
      id="videoExportArea"
      className="w-full max-w-full overflow-hidden  px-2 py-6 md:px-16"
    >
      <div className="relative mx-auto flex max-w-6xl flex-col gap-3 md:flex-row-reverse">
        <div className="rounded-md bg-slate-100 p-3 md:w-1/3">
          <h3 className="self-center font-medium text-gray-900">
            Aspect Ratio
          </h3>
          <Select
            className="basic-single mt-1 grow self-start text-sm @xl:mt-0"
            classNamePrefix="select"
            controlShouldRenderValue={true}
            blurInputOnSelect={true}
            defaultValue={frameRatios[0]}
            onChange={(option) => {
              if (option) {
                const [w, h] = option.value.split("x");
                setWidth(Number(w));
                setHeight(Number(h));
              }
            }}
            isClearable={false}
            isSearchable={true}
            name={"ratio"}
            options={frameRatios}
            styles={{
              input: (base) => ({
                ...base,
                "input:focus": {
                  boxShadow: "none",
                },
              }),
            }}
          />
          <p className="mt-3 text-sm font-medium text-gray-700">
            Dimensions in pixels: {width}x{height}
          </p>
          <div>
            <p className="mt-3 font-medium  text-gray-900">
              Preview in Remotion Preview
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Start Remotion Preview locally with command{" "}
              <code className="rounded-sm bg-slate-200 p-1 text-gray-900">
                yarn&nbsp;video
              </code>{" "}
              and click button below.
            </p>
            <Button
              className=" mt-5 "
              variant="outline"
              color="red"
              onClick={openPreview}
            >
              Open preview on localhost:3001
            </Button>
          </div>
          <div className="mt-4">
            <p className="mt-3 font-medium  text-gray-900">Render video</p>
            <p className="mt-1 text-sm text-gray-700">
              If you would be interested to use this project to render videos
              online, without having to install anything, please let me know.
            </p>
            <Button
              className=" mt-5 "
              variant="solid"
              color="blue"
              onClick={openFeedbackForm}
            >
              Ask about video rendering
            </Button>
          </div>
          <div className="mt-4">
            <p className="mt-3 font-medium  text-gray-900">Embed Player</p>
            <p className="mt-1 text-sm text-gray-700">
              If you would be interested to embed this player on your website,
              please reach out to me below.
            </p>
            <Button
              className=" mt-5 "
              variant="solid"
              color="blue"
              onClick={openFeedbackForm}
            >
              Ask about embedding player
            </Button>
          </div>
        </div>

        <div className="md:flex md:w-2/3 md:justify-center">
          <div
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-xl",
              height > width ? "h-[80vh]" : "h-full",
              "md:h-[80vh]"
            )}
          >
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={async () => await refetch()}
            >
              <Player
                component={MainVideo as any}
                inputProps={{ data: scenes }}
                durationInFrames={fps * duration}
                compositionWidth={width}
                compositionHeight={height}
                fps={fps}
                style={{
                  ...(height > width && { height: "100%" }),
                  ...(width >= height && { width: "100%" }),
                  maxHeight: "100%",
                  maxWidth: "100%",
                  margin: "auto",
                }}
                controls
                className=" overflow-hidden rounded-md shadow-xl "
              />
            </ErrorBoundary>
          </div>
        </div>
        <div
          className="absolute top-2/3 -right-full left-[45vw] -bottom-10 -z-10 rounded-tl-3xl bg-blue-600
            text-white/20 "
        >
          <GridPattern x="100%" y="100%" patternTransform="translate(112 64)" />
        </div>
      </div>
    </section>
  );
};

export default PlayerSection;
