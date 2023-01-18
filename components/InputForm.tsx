import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import fetchBase from "../utils/fetchBase";
import { Button } from "./Button";

type Props = {
  children: (metadata: Metadata, credentials: Credentials) => React.ReactNode;
};

const InputForm: React.FC<Props> = (props) => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [animateRef] = useAutoAnimate<HTMLDivElement>();
  const {
    data: metadata,
    error,
    isFetching,
  } = useQuery<any, Error>({
    queryKey: [credentials?.linkToTable, credentials?.apiKey],
    queryFn: () =>
      credentials
        ? fetchBase(credentials?.linkToTable, credentials?.apiKey)
        : null,
    enabled: credentials !== null,
    refetchOnWindowFocus: false,
  });

  console.log(metadata);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Credentials>();

  useEffect(() => {
    if (localStorage.getItem("credentials")) {
      const localCredentials = JSON.parse(localStorage.getItem("credentials")!);
      setCredentials(localCredentials);
      setValue("linkToTable", localCredentials.linkToTable);
      setValue("apiKey", localCredentials.apiKey);
    }
  }, []);

  const onSubmit: SubmitHandler<Credentials> = async (credentials) => {
    console.log("on submit?");
    console.log(credentials);
    localStorage.setItem("credentials", JSON.stringify(credentials));
    setCredentials(credentials);
  };

  const clearCredentials = () => {
    console.log("clear");
    setCredentials(null);
    reset();
    localStorage.removeItem("credentials");
  };

  return (
    <>
      <section
        id="makeVideo"
        className=" w-full bg-slate-100 px-2 py-6 md:px-16 lg:py-20"
      >
        <div className="mx-auto mt-10 max-w-6xl sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Airtable Access
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Insert link to Table you want to use and your API key
                  <br />
                  <br /> <strong className="font-extrabold">*</strong> if you
                  are using Beta Web API Personal Access token include following
                  scopes:
                </p>
                <ul className="mt-1 list-inside list-disc pl-2 text-xs text-gray-600 ">
                  <li>schema.bases:read </li>
                  <li>data.records:read</li>
                </ul>
              </div>
            </div>
            <div
              ref={animateRef}
              className="mt-5 flex flex-col md:col-span-2 md:mt-0"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 items-end gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="linkToTable"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Link to Airtable base and table
                        </label>
                        <input
                          type="text"
                          disabled={credentials ? true : false}
                          id="linkToTable"
                          placeholder="https://airtable.com/appXXXXXXX/tblYYYYYY/viwZZZZZZ?blocks=hide"
                          autoComplete="linkToTable"
                          className={clsx(
                            "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
                            errors.linkToTable &&
                              "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
                            credentials && "bg-gray-200"
                          )}
                          {...register("linkToTable", { required: true })}
                        />
                        {errors.linkToTable && (
                          <span className="mt-2 text-sm text-red-600">
                            This field is required
                          </span>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="apiKey"
                          className="block text-sm font-medium text-gray-700"
                        >
                          API Key - User API key or Personal access token*
                        </label>
                        <input
                          type="password"
                          id="apiKey"
                          disabled={credentials ? true : false}
                          placeholder="keyXXXX or patXXXX"
                          className={clsx(
                            "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
                            errors.linkToTable &&
                              "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
                            credentials && "bg-gray-200"
                          )}
                          {...register("apiKey", {
                            required: true,
                          })}
                        />
                        {errors.apiKey && (
                          <span className="mt-2 text-sm text-red-600">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!credentials && (
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <Button type="submit" variant="solid" color="blue">
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </form>
              {isFetching && (
                <span className="mt-2 pl-4 text-sm ">Loading...</span>
              )}
              {!!error && (
                <>
                  <span className="mt-2 pl-4 text-sm   text-red-600">
                    Error fetching data from Airtable
                  </span>

                  <span className="mt-2 pl-4 text-sm   text-red-600">
                    {error?.message}
                  </span>
                </>
              )}
              {credentials && (
                <Button
                  onClick={clearCredentials}
                  className="mt-5 self-end  "
                  variant="outline"
                  color="red"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      {!!metadata && !!credentials && props.children(metadata, credentials)}
    </>
  );
};

export default InputForm;
