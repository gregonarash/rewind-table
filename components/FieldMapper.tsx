import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
  FieldsMapping,
  ScenesRequestParams,
  defaultFields,
} from "../pages/api/fetch-scenes";
import { destructureAirtableUrl } from "../utils/fetchBase";
import { Button } from "./Button";

export type SelectOption = {
  readonly value: string;
  readonly label: string;
  readonly type?: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
};

type Props = {
  metadata: {
    tables: Table[];
  };
  credentials: Credentials;
  setRequestParams: (requestParams: ScenesRequestParams | null) => void;
};

const FieldMapper: React.FC<Props> = ({
  metadata,
  credentials,
  setRequestParams,
}) => {
  const { baseId, tableId, viewId } = destructureAirtableUrl(
    credentials.linkToTable
  );

  const tables = metadata.tables.map((table) => ({
    label: table.name,
    value: table.id,
  }));

  const [selectedTable, setSelectedTable] = useState<SelectOption>(
    tables.filter((table) => table.value === tableId)[0]
  );

  const views = useMemo(
    () =>
      metadata.tables
        .filter((table) => table.id === selectedTable.value)[0]
        .views.map((view) => ({
          label: view.name,
          value: view.id,
          type: view.type,
        })),
    [selectedTable]
  );

  const [selectedView, setSelectedView] = useState<SelectOption>(
    views.filter((view) => view.value === viewId)[0] || views[0]
  );

  useEffect(() => {
    setSelectedView(
      views.filter((view) => view.value === viewId)[0] || views[0]
    );
  }, [views]);

  const fields = useMemo(
    () =>
      metadata.tables
        .filter((table) => table.id === selectedTable.value)[0]
        .fields.map((field) => ({
          label: field.name,
          value: field.id,
          type: field.type,
        })),
    [selectedTable]
  );

  const calculateDefaultFields = (
    defaultFields: FieldsMapping,
    fields: SelectOption[]
  ) =>
    (Object.keys(defaultFields) as (keyof FieldsMapping)[]).reduce(
      (acc, key) => ({
        ...acc,
        [key]:
          fields.filter(
            (field) =>
              field.label === defaultFields[key].defaultName &&
              field.type &&
              defaultFields[key].type.includes(field.type)
          )[0] || undefined,
      }),
      {} as any
    );

  const [selectedFields, setSelectedFields] = useState<{
    [K in keyof FieldsMapping]: SelectOption | undefined;
  }>(calculateDefaultFields(defaultFields, fields));

  //if fields change because changing tables - the selected fields should be reset
  useEffect(() => {
    setSelectedFields(calculateDefaultFields(defaultFields, fields));
  }, [fields]);

  const selectedFieldsLabels = (
    Object.keys(selectedFields) as (keyof FieldsMapping)[]
  ).reduce(
    (acc, key) => ({
      ...acc,
      ...(typeof selectedFields[key] !== "undefined" && {
        [key]: selectedFields[key]!.label,
      }),
    }),
    {} as { [K in keyof FieldsMapping]: string | undefined }
  );

  const loadSceneData = () => {
    if (!selectedFieldsLabels.startFrom) {
      alert("Please select a field for the start time");
    } else if (!selectedFieldsLabels.durationInSeconds) {
      alert("Please select a field for the duration");
    } else if (!selectedFieldsLabels.text) {
      alert("Please select a field for the text");
    } else if (!selectedFieldsLabels.media) {
      alert("Please select a field for the media");
    } else {
      setRequestParams({
        apiKey: credentials.apiKey,
        baseId,
        table: selectedTable.label,
        view: selectedView.label,
        fieldNames: {
          name: selectedFieldsLabels.name,
          startFrom: selectedFieldsLabels.startFrom,
          durationInSeconds: selectedFieldsLabels.durationInSeconds,
          text: selectedFieldsLabels.text,
          media: selectedFieldsLabels.media,
          textStyle: selectedFieldsLabels.textStyle,
          mediaStyle: selectedFieldsLabels.mediaStyle,
          bgStyle: selectedFieldsLabels.bgStyle,
          animation: selectedFieldsLabels.animation,
          volume: selectedFieldsLabels.volume,
        },
      });
      const videoArea = document.getElementById("videoExportArea");
      window.scrollTo({
        top: videoArea?.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="makeVideo"
      className="relative w-full bg-slate-100 px-2 py-6 md:px-16"
    >
      <div className="mx-auto max-w-6xl sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Select Table and View
            </h3>
          </div>
          <div className="mt-5 flex flex-col md:col-span-2 md:mt-0">
            <div className="bg-white px-4 py-5 shadow @container sm:rounded-md sm:p-6 ">
              <div className="mb-5 @xl:flex">
                <div className="block self-center text-sm font-medium text-gray-700 @xl:mr-3 @xl:grow-0 @xl:basis-32">
                  Table
                </div>
                <Select
                  className="basic-single  mt-1 grow self-start text-sm @xl:mt-0"
                  classNamePrefix="select"
                  controlShouldRenderValue={true}
                  blurInputOnSelect={true}
                  defaultValue={selectedTable}
                  onChange={(e) => e && setSelectedTable(e)}
                  isClearable={false}
                  menuPortalTarget={document.body}
                  isSearchable={true}
                  name="tables"
                  options={tables}
                  //getOptionLabel={(option) => `${option.label}: ${option.value}`}
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
              <div className="mb-5 @xl:flex">
                <div className="block self-center text-sm font-medium text-gray-700 @xl:mr-3 @xl:grow-0 @xl:basis-32">
                  View
                </div>
                <Select
                  className="basic-single  mt-1 grow self-start text-sm @xl:mt-0"
                  classNamePrefix="select"
                  controlShouldRenderValue={true}
                  blurInputOnSelect={true}
                  defaultValue={selectedView}
                  onChange={(e) => e && setSelectedView(e)}
                  value={selectedView}
                  isClearable={false}
                  isSearchable={true}
                  menuPortalTarget={document.body}
                  name="views"
                  options={views}
                  //getOptionLabel={(option) => `${option.label}: ${option.type}`}
                  formatOptionLabel={(option) => (
                    <>
                      <span>{option.label} </span>
                      <span className="text-xs text-slate-500">
                        {" "}
                        ( {option.type} )
                      </span>
                    </>
                  )}
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="z-40 mt-5 md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Map data fields
            </h3>
            <p className="mt-1 text-gray-900">
              Insert link to Table you want to use and your API key{" "}
            </p>
            <p className="mt-1"> Mandatory:</p>
            <ul className="mt-1 list-inside list-disc pl-2 text-sm text-gray-600 ">
              {(Object.keys(defaultFields) as (keyof FieldsMapping)[])
                .filter(
                  (defaultFieldName) =>
                    defaultFields[defaultFieldName].mandatory
                )
                .map((defaultFieldName) => {
                  return (
                    <li key={defaultFieldName}>
                      {defaultFields[defaultFieldName].defaultName}{" "}
                      {/* <span className="text-xs text-slate-500">
                        {defaultFields[
                          defaultFieldName as keyof FieldsMapping
                        ].type.join(", ")}
                      </span> */}
                    </li>
                  );
                })}
            </ul>

            <p className="mt-1">Optional:</p>
            <ul className="mt-1 list-inside list-disc pl-2 text-sm text-gray-600 ">
              {(Object.keys(defaultFields) as (keyof FieldsMapping)[])
                .filter(
                  (defaultFieldName) =>
                    !defaultFields[defaultFieldName].mandatory
                )
                .map((defaultFieldName) => {
                  return (
                    <li key={defaultFieldName}>
                      {defaultFields[defaultFieldName].defaultName}{" "}
                      {/* <span className="text-xs text-slate-500">
                        {defaultFields[
                          defaultFieldName as keyof FieldsMapping
                        ].type.join(", ")}
                      </span> */}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="mt-5 flex flex-col md:col-span-2 md:mt-0">
            <div className="bg-white px-4 py-5 shadow @container sm:rounded-md sm:p-6 ">
              {(Object.keys(defaultFields) as (keyof FieldsMapping)[]).map(
                (defaultField) => {
                  return (
                    <div key={defaultField} className="mb-5 @xl:flex">
                      <div className="block self-center text-sm font-medium text-gray-700 @xl:mr-3 @xl:grow-0 @xl:basis-32">
                        {defaultFields[defaultField].defaultName}
                      </div>
                      <SelectWithLabel
                        options={fields.map((field) => ({
                          ...field,
                          ...(!defaultFields[defaultField].type.includes(
                            field.type
                          ) && { isDisabled: true }),
                        }))}
                        name={defaultField}
                        defaultValue={selectedFields?.[defaultField]}
                        value={
                          typeof selectedFields?.[defaultField] === "undefined"
                            ? null
                            : selectedFields?.[defaultField]
                        }
                        onChange={(e) =>
                          e &&
                          setSelectedFields((state) => ({
                            ...state,
                            [defaultField]: e,
                          }))
                        }
                      />
                    </div>
                  );
                }
              )}

              <div className="flex w-full justify-end">
                <Button onClick={loadSceneData} color="blue">
                  Load records
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldMapper;

interface SelectOptionsWithType extends SelectOption {
  type?: string | undefined;
}

const SelectWithLabel = ({
  defaultValue,
  value,
  onChange,
  name,
  options,
}: {
  defaultValue?: SelectOptionsWithType;
  value?: SelectOptionsWithType | null;
  onChange: (e: any) => void;
  name: string;
  options: SelectOptionsWithType[];
}) => (
  <Select
    className="basic-single mt-1 grow self-start text-sm @xl:mt-0"
    classNamePrefix="select"
    controlShouldRenderValue={true}
    blurInputOnSelect={true}
    defaultValue={defaultValue}
    onChange={onChange}
    value={value}
    menuPortalTarget={document.body}
    isClearable={false}
    isSearchable={true}
    name={name}
    options={options}
    formatOptionLabel={(option, e) => (
      <>
        <span>{option.label}</span>
        <span className="text-xs  "> ( {option.type} )</span>
      </>
    )}
    styles={{
      input: (base) => ({
        ...base,
        "input:focus": {
          boxShadow: "none",
        },
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    }}
  />
);
