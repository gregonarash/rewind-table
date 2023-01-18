const fetchBase = async (url: string, apiKey: string) => {
  const { baseId, tableId, viewId } = destructureAirtableUrl(url);
  const isNewAPI = apiKey?.length > 20;

  if (isNewAPI) {
    const metadata = await getMetaDataAirtableWebApi(baseId, apiKey);

    const base = metadata.tables.find((table: any) => table.id === baseId);

    return await getMetaDataAirtableWebApi(baseId, apiKey);
  }

  return { baseData: "null", error: "old api" };
};

export default fetchBase;

const getMetaDataAirtableWebApi = async (baseId: string, apiKey: string) => {
  const baseUrl = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

  const metadata = await fetch(baseUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (metadata.status >= 200 && metadata.status <= 299) {
    return await metadata.json();
  } else {
    const errorData = await metadata.json();
    throw Error(
      metadata.statusText + " " + JSON.stringify(errorData) || "Error"
    );
  }
};

export const destructureAirtableUrl = (url: string) => {
  const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
  const [baseId, tableId, viewId] = parsedUrl.pathname.split("/").slice(1);
  return { baseId, tableId, viewId };
};
