"use client";

import { useEffect } from "react";
import Head from "next/head";
import metadata from "./metadata"; // Import metadata

const HeadComponent = () => {
  useEffect(() => {
    document.title = metadata.title; // 🔥 Force title update
  }, []);

  return (
    <Head>
      <meta name="description" content={metadata.description} />
    </Head>
  );
};

export default HeadComponent;
