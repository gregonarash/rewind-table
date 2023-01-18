import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Hero from "../components/Hero";
import InputForm from "../components/InputForm";
import { ScenesRequestParams } from "./api/fetch-scenes";

const FieldMapper = dynamic(() => import("../components/FieldMapper"), {
  ssr: false,
});

const PlayerSection = dynamic(() => import("../components/PlayerSection"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [requestParams, setRequestParams] =
    useState<ScenesRequestParams | null>(null);

  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>Rewind Table</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center text-center"></main>
      <Hero />

      <InputForm>
        {(metadata, credentials) => (
          <FieldMapper
            metadata={metadata}
            credentials={credentials}
            setRequestParams={setRequestParams}
          />
        )}
      </InputForm>
      {!!requestParams && <PlayerSection {...requestParams} />}

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  );
};

export default Home;
