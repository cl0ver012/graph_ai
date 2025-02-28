import { useState } from "react";
import IMAGES from "../../../../../assets/images";

const QuickStart = () => {
  const [activeTab, setActiveTab] = useState("cURL");

  const queryExample: any = {
    cURL: `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } bundles(first: 5) { id ethPriceUSD } }", "operationName": "Subindexes", "variables": {}}' \\
  https://api.graphRAG.com/api/{api-key}/subindexes/id/5zvR82QoaXYFyDEKLZ9t6v9adgntpYpKpSbxtgVENFV`,
    React: `import { request } from 'graphql-request';

const query = \`{
  factories(first: 5) { id poolCount txCount totalVolumeUSD }
  bundles(first: 5) { id ethPriceUSD }
}\`;

const fetchData = async () => {
  const data = await request('https://api.graphRAG.com/api/{api-key}/subindexes/id/5zvR82QoaXYFyDEKLZ9t6v9adgntpYpKpSbxtgVENFV', query);
  console.log(data);
};`,
    NextJS: `export async function getServerSideProps() {
  const res = await fetch('https://api.graphRAG.com/api/{api-key}/subindexes/id/5zvR82QoaXYFyDEKLZ9t6v9adgntpYpKpSbxtgVENFV', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } }" }),
  });
  const data = await res.json();
  return { props: { data } };
}`,
    Node: `const fetch = require("node-fetch");

const query = \`{
  factories(first: 5) { id poolCount txCount totalVolumeUSD }
  bundles(first: 5) { id ethPriceUSD }
}\`;

fetch('https://api.graphRAG.com/api/{api-key}/subindexes/id/5zvR82QoaXYFyDEKLZ9t6v9adgntpYpKpSbxtgVENFV', {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));`,
  };

  return (
    <div className="w-full border border-[#FFFFFF14] rounded-lg p-2 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Query quick start</h2>
          </div>
          <p className="text-[#FFFFFF7A] text-sm mt-1 mb-10">
            The production URL for querying this Subindex on the decentralized
            network.
          </p>

          <div className="rounded-lg mt-2">
            <div className="flex gap-1 items-center mb-2">
              <img src={IMAGES.info} className="w-4" alt="info" />
              <span className="uppercase text-white text-opacity-65 text-xs">
                Query URL format
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="">{`{base_url}`}</span>
              <span className="text-[#FFFFFF7A]">/api/</span>
              <span className="">{`{api-key}`}</span>
              <span className="text-[#FFFFFF7A]">/subgroup/id/</span>
              <span className="">{`{subgroup-id}`}</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between p-4 rounded-lg border-b border-[#FFFFFF14]">
            <p className="uppercase text-white text-opacity-65 text-xs">
              Api key
            </p>
            <div className="text-sm flex items-center gap-4 bg-[#ffffff1e] px-4 py-1 text-[#C6C8CF] rounded-md">
              See your API keys
              <img
                src={IMAGES.arrow_up_right}
                className="w-4"
                alt="arrow_up_right"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border-b border-[#FFFFFF14]">
            <p className="uppercase text-white text-opacity-65 text-xs">
              Query Endpoint
            </p>
            <p className="text-gray-300 text-sm truncate">
              https://api.thegraph.com/subgraphs/name/ethereum
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg mt-2">
            <p className="uppercase text-white text-opacity-65 text-xs">
              GraphQL Playground Link
            </p>
            <p className="underline text-sm cursor-pointer truncate">
              5zvR82QoaXYFyDEKLZ9t6v9adgntpYpKpSbxtgVENFV
            </p>
          </div>

          <div className=" rounded-lg mt-2 bg-white bg-opacity-10 overflow-hidden">
            <div className="flex justify-between  items-center bg-[#FFFFFF05] p-2">
              <span className="text-[#FFFFFFA3] text-sm">Query URL format</span>
              <img src={IMAGES.copy} className="w-4" alt="copy" />
            </div>
            <p className="text-gray-300 text-sm p-4">
              1. https://api.GraphRAG.com/subindexes/name/ethereum/
            </p>
          </div>
        </div>
      </div>

      {/* Example Usage Tabs */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Example Usage</h2>
          <div className="text-sm flex items-center gap-3  px-4 py-1 text-[#C6C8CF] ">
            <img src={IMAGES.github} className="w-4" alt="github" />
            Example Repository
            <img
              src={IMAGES.arrow_up_right}
              className="w-4"
              alt="arrow_up_right"
            />
          </div>
        </div>
        <div className="rounded-lg mt-2 bg-white bg-opacity-10 overflow-hidden">
          <div className="flex border-b border-white border-opacity-15 bg-[#FFFFFF05]">
            {["cURL", "React", "NextJS", "Node"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm ${
                  activeTab === tab
                    ? "border-b-2 border-[#6F4CFF] text-white"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className=" p-4 rounded-lg mt-2">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {queryExample[activeTab]}
            </pre>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="">
        <div className="text-sm flex items-center gap-3  px-4 py-1 text-[#C6C8CF] ">
          Document
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#FFFFFF14] p-4 rounded-lg cursor-pointer hover:bg-gray-700">
            <p className="text-sm mb- ">How To Query Subindexes</p>
            <p className=" text-[#FFFFFF7A]">
              Query Subindexes using multiple languages.
            </p>
          </div>
          <div className="border border-[#FFFFFF14] p-4 rounded-lg cursor-pointer hover:bg-gray-700">
            <p className="text-sm mb-4 ">Querying Best Practices</p>
          </div>
          <div className="border border-[#FFFFFF14] p-4 rounded-lg  cursor-pointer hover:bg-gray-700">
            <p className="text-sm ">Understanding Schema & Data Structure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
