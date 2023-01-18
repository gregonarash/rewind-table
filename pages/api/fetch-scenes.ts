// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export interface SceneData {
  name?: string;
  durationInSeconds: number;
  startFrom: number;
  media?: { url: string; type: string }[];
  text?: string;
  textStyle?: string;
  mediaStyle?: string;
  bgStyle?: string;
  animation?: string[];
  volume?: number;
}

export type ScenesRequestParams = {
  apiKey: string;
  baseId: string;
  table: string;
  view?: string;
  fieldNames: MandatoryFields & {
    name?: string;
    textStyle?: string;
    mediaStyle?: string;
    bgStyle?: string;
    animation?: string;
    volume?: string;
  };
};

export const defaultFields = {
  name: {
    defaultName: "Name",
    type: ["singleLineText", "formula"],
    mandatory: false,
  },
  startFrom: { defaultName: "Start", type: ["duration"], mandatory: true },
  durationInSeconds: {
    defaultName: "Duration",
    type: ["duration"],
    mandatory: true,
  },
  media: {
    defaultName: "Media",
    type: ["multipleAttachments"],
    mandatory: true,
  },
  text: {
    defaultName: "Text",
    type: ["singleLineText", "multilineText", "formula"],
    mandatory: true,
  },
  textStyle: {
    defaultName: "Text style",
    type: ["singleLineText", "multilineText", "formula"],
    mandatory: false,
  },
  mediaStyle: {
    defaultName: "Media style",
    type: ["singleLineText", "multilineText", "formula"],
    mandatory: false,
  },
  bgStyle: {
    defaultName: "Background style",
    type: ["singleLineText", "multilineText", "formula"],
    mandatory: false,
  },
  animation: {
    defaultName: "Animation code (from Animation)",
    type: ["multipleLookupValues"],
    mandatory: false,
  },
  volume: {
    defaultName: "Volume",
    type: ["number"],
    mandatory: false,
  },
};

const mandatoryFieldKeys = [
  "startFrom",
  "durationInSeconds",
  "media",
  "text",
] as const;

type MandatoryFields = {
  [key in (typeof mandatoryFieldKeys)[number]]: string;
};

export type FieldsMapping = typeof defaultFields;

export const fetchScenes = async ({
  apiKey,
  baseId,
  table,
  view,
  fieldNames,
}: ScenesRequestParams) => {
  const body = {
    view,
    fields: Object.values(fieldNames),
  };

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURI(table)}/listRecords`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  const json = await response.json();

  const data: SceneData[] = json.records
    .filter((record: any) => record.fields[fieldNames.durationInSeconds])
    .map((record: any) => ({
      durationInSeconds: record.fields[fieldNames.durationInSeconds],
      startFrom: record.fields[fieldNames.startFrom],
      media: record.fields[fieldNames.media]?.map(
        ({ url, type }: { url: string; type: string }) => ({ url, type })
      ),
      text: record.fields[fieldNames.text],
      name: fieldNames.name ? record.fields[fieldNames.name] : null,
      textStyle: fieldNames.textStyle
        ? record.fields[fieldNames.textStyle]
        : null,
      mediaStyle: fieldNames.mediaStyle
        ? record.fields[fieldNames.mediaStyle]
        : null,
      bgStyle: fieldNames.bgStyle ? record.fields[fieldNames.bgStyle] : null,
      animation: fieldNames.animation
        ? record.fields[fieldNames.animation]
        : null,
      volume: fieldNames.volume ? record.fields[fieldNames.volume] : null,
    }));

  const dataWithStartFrom = (): [SceneData[], number] => {
    let timePointer = 0;
    let duration = 0;
    const dataWithStartTimes = data.map((scene: SceneData) => {
      const startFrom = scene.startFrom ?? timePointer;
      timePointer = startFrom + scene.durationInSeconds;
      // this logic was putting pointer behind the latest time
      // timePointer =
      //   startFrom + scene.durationInSeconds > timePointer
      //     ? startFrom + scene.durationInSeconds
      //     : timePointer;
      duration = timePointer > duration ? timePointer : duration;

      return { ...scene, startFrom };
    });

    return [dataWithStartTimes, duration];
  };

  return dataWithStartFrom();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<[SceneData[], number] | { error: string }>
) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Only POST requests are allowed" });
    return;
  }
  if (!req.body) {
    res.status(400).json({ error: "No body" });
    return;
  }

  const requestParams: ScenesRequestParams = JSON.parse(req.body);
  console.log("req body", req.body);

  const { apiKey, baseId, table, view, fieldNames } = requestParams;

  if (!table) {
    res.status(400).json({ error: "No table selected" });
    return;
  }

  console.log("fieldnames", fieldNames);

  console.log("values", Object.values(fieldNames));

  const data = await fetchScenes({ apiKey, baseId, table, view, fieldNames });

  res.status(200).json(data);
}
