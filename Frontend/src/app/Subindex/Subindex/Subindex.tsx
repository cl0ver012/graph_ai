"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/Navbar/page";
import { socketEndpoint } from "@/context/indexSocket";
import GenericViewer from "@/app/Create-Subindex/Create-Subindex/GenericViewer";
import dynamic from 'next/dynamic';

// Import GraphQL Playground dynamically to prevent SSR issues
const GraphQLPlayground = dynamic(
  () => import('@/components/GraphQLPlayground'),
  { ssr: false }
);

interface GraphData {
  chatId: string;
  userId: string;
  selectedProvider: string;
  createdAt: string;
  indexName?: string;
  about?: string;
  endpoint: string;
  description: string;
}

const Subindex = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");

  const [activeTab, setActiveTab] = useState<keyof typeof exampleCode>("cURL");
  const [activeTabs, setActiveTabs] = useState("Query");
  const [showPopup, setShowPopup] = useState(false);
  const [dynamicApiUrl, setDynamicApiUrl] = useState("");
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // Construct the query-index endpoint URL
  const queryIndexEndpoint = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/query-index`;

  useEffect(() => {
    const id = searchParams.get("id");

    const fetchGraphData = async () => {
      try {
        const response = await fetch(`${apiURL}/graphdata/${id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        setGraphData(data);
        setDynamicApiUrl(apiURL + "/rag/" + data.endpoint);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, [searchParams]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Shorten the URL to first 15 characters + "..."
  const shortenedUrl =
    currentUrl.length > 25 ? currentUrl.substring(0, 25) + "..." : currentUrl;

  const fullEndpoint = dynamicApiUrl || "Not Provided";

  const shortenedEndpoint =
    fullEndpoint.length > 25
      ? fullEndpoint.substring(0, 25) + "..."
      : fullEndpoint;

  const [htmlGraph, setHtmlGraph] = useState<string | null>(null);
  const [schema, setSchema] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHtmlGraph = async () => {
      console.log("Fetching HTML Graph...", graphData);
      if (!graphData?.chatId || !graphData.userId) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://${socketEndpoint}/api/subgraph_html/${graphData?.userId}/${graphData?.chatId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.warn(`Failed to fetch HTML graph. Status: ${res.status}. Response: ${errorText}`);
          setHtmlGraph(null);
          return;
        }

        const data = await res.json();
        if (data.html) {
          setHtmlGraph(data.html);
        } else {
          console.warn("HTML Graph API response OK, but no HTML content found.");
          setHtmlGraph(null);
        }
      } catch (error) {
        console.error("Error during HTML graph fetch operation:", error);
        setHtmlGraph(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchSchema = async () => {
      console.log("Fetching Schema Graph...", graphData);
      if (!graphData?.chatId || !graphData.userId) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://${socketEndpoint}/api/subgraph/${graphData?.userId}/${graphData?.chatId}/schema`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.warn(`Failed to fetch schema. HTTP Status: ${res.status}. Response: ${errorText}`);
          setSchema(null);
          return;
        }

        const data = await res.json();

        if (data && data.code === "Neo.ClientError.Database.DatabaseNotFound") {
          console.warn(`Schema not found (API indicated, expected during index creation): ${data.message}`);
          setSchema(null);
        }
        else if (typeof data.schema === "string" && data.schema.toLowerCase().startsWith("error")) {
          console.warn(`Schema API returned an error string in schema property: ${data.schema}`);
          setSchema(null);
        }
        else if (data.schema !== undefined) {
          setSchema(data.schema);
        }
        else {
          console.warn("Schema API response OK, but no valid schema content found or structure is unexpected.", data);
          setSchema(null);
        }
      } catch (error: any) {
        if (error && error.code === "Neo.ClientError.Database.DatabaseNotFound") {
          console.warn(`Schema not found (error caught, expected during index creation): ${error.message}`);
        } else {
          console.error("Unexpected error during schema fetch operation:", error);
        }
        setSchema(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHtmlGraph();
    fetchSchema();
  }, [graphData]);

  const tabs = ["Query"];

  const exampleCode = {
    cURL: `
    >_ bash
    curl -X POST \\
    -H "Content-Type: application/json" \\
    -d '{
      "query": "YOUR_QUESTION_HERE",
      "userId": "${graphData?.userId || 'YOUR_USER_ID'}",
      "databaseId": "${graphData?.chatId || 'YOUR_DATABASE_ID'}"
    }' \\
    ${queryIndexEndpoint}
        `,
    React: `
    import axios from 'axios';
    
    const fetchData = async () => {
        const response = await axios.post("${queryIndexEndpoint}", {
            query: "YOUR_QUESTION_HERE",
            userId: "${graphData?.userId || 'YOUR_USER_ID'}",
            databaseId: "${graphData?.chatId || 'YOUR_DATABASE_ID'}"
        });
        console.log(response.data);
    };
    
    fetchData();
        `,
    NextJS: `
    // In your API route or server component
    async function askQuestion() {
      const response = await fetch("${queryIndexEndpoint}", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: "YOUR_QUESTION_HERE",
            userId: "${graphData?.userId || 'YOUR_USER_ID'}",
            databaseId: "${graphData?.chatId || 'YOUR_DATABASE_ID'}"
        })
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
    // Call askQuestion() where needed
        `,
    Node: `
    const fetch = require('node-fetch'); // or import fetch from 'node-fetch';
    
    async function fetchData() {
        const response = await fetch("${queryIndexEndpoint}", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: "YOUR_QUESTION_HERE",
                userId: "${graphData?.userId || 'YOUR_USER_ID'}",
                databaseId: "${graphData?.chatId || 'YOUR_DATABASE_ID'}"
            })
        });
        const data = await response.json();
        console.log(data);
    }
    
    fetchData();
        `,
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      {/* External Navbar */}
      <Navbar />

      {/* Heading Section */}
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">
              {graphData?.indexName || "not provided"}
            </h1>
            <br />
            <p className="text-gray-400 mt-1 text-sm">
              {graphData?.description || "No Description Available"}
            </p>
            <br />
            <p className="text-gray-500 text-sm mt-1">
              ⚡ Queries: 12.4k | Updated a year ago
            </p>
            <div className="mt-6 flex items-center justify-center text-gray-400 font-semibold text-sm">
              <span>
                PROVIDER <br />
                {graphData?.selectedProvider}
              </span>

              <span className="mx-4 text-white">|</span>
              <span>
                NATURAL LANGUAGE QUERY ENDPOINT <br />
                <a
                  href={queryIndexEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {queryIndexEndpoint}
                </a>
              </span>
              <span className="mx-4 text-white">|</span>
              <span>
                QUERY DOCUMENTATION
                <br />
                <a
                  href="#documentation"
                  className="text-blue-400 hover:underline"
                >
                  documentation
                </a>
              </span>
            </div>
            <div className="flex items-center mt-3">
              <span className="bg-green-600 text-black px-2 py-1 text-xs rounded-full">
                🟢 LIVE
              </span>
              <span className="ml-2 text-gray-400 text-sm">Progress: 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex space-x-6 border-b border-gray-800 px-8 text-sm">
        {tabs.map((page) => (
          <button
            key={page}
            onClick={() => setActiveTabs(page)}
            className={`py-2 border-b-2 transition ${
              activeTab === page
                ? "text-white border-white"
                : "text-gray-400 border-transparent hover:text-white hover:border-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Query Page Content */}
      <div className="p-8 grid grid-cols-2 gap-6">
        {/* Left View (Dynamic Content) */}
        <div className="bg-[#1E1E1E] p-4 rounded-lg h-96 overflow-y-auto text-sm">
          {activeTabs === "Query" && (
            <GenericViewer content={schema} type="text" loading={loading} />
          )}
          {activeTabs === "About" && (
            <div>
              <h2 className="text-xl font-bold">About Ethereum Subindex</h2>
              <p className="text-gray-400 mt-2">
                {graphData?.about || "No About Data Available"}
              </p>
            </div>
          )}
        </div>

        <div
          id="graph-container"
          className=" p-4 bg-[#1E1E1E] text-white rounded-lg h-96 flex justify-center items-center text-sm"
        >
          <GenericViewer content={htmlGraph} type="html" loading={loading} />
        </div>
      </div>

      {/* GraphQL Playground Section */}
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">GraphQL Playground</h2>
        <div className="w-full">
          <GraphQLPlayground 
            endpoint={dynamicApiUrl} 
            height="500px"
            userId={graphData?.userId}
            dbId={graphData?.chatId}
          />
        </div>
      </div>

      {/* Query Quick Start */}
      <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Query Quick Start */}
        <div className="p-4 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-lg sm:text-xl font-bold">Query Quick Start</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Use the endpoint below to query your Subindex with natural language.
            Send a POST request with a JSON body containing your query, userId, and databaseId.
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Query URL</span>
              <span className="text-gray-500 truncate">[POST Request]</span>
            </div>
            <div className="mt-2 p-2 bg-gray-900 rounded-lg text-xs sm:text-sm break-all">
              <a
                href={queryIndexEndpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {queryIndexEndpoint}
              </a>
            </div>
          </div>
        </div>

        {/* API Key and Query Endpoint Section - Simplified */}
        <div className="p-4 rounded-lg bg-[#1E1E1E] col-span-1 sm:col-span-2 lg:col-span-3">
          <h2 className="text-lg sm:text-xl font-bold">
            Query Endpoint (Natural Language)
          </h2>
          <div className="mt-4">
            {/* Query Endpoint */}
            <div className="flex justify-between whitespace-nowrap mt-2 border-b border-gray-700 p-2 text-xs sm:text-sm">
              <span className="text-gray-400">Endpoint URL</span>
              <div className="p-2 truncate">
                <a
                  href={queryIndexEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 overflow-hidden text-ellipsis hover:underline"
                >
                  {queryIndexEndpoint}
                </a>
              </div>
            </div>

            {/* Query URL Box */}
            <div className="bg-gray-900 rounded-lg text-xs sm:text-sm mt-4 w-full">
              <div className="flex border-b border-gray-700 p-3">
                <span className="text-gray-500">Example Request Body (POST)</span>
              </div>
              <div className="p-4 break-all overflow-hidden">
                <pre className="text-gray-400 text-wrap ">
                  {`{
  "query": "Your natural language question...",
  "userId": "${graphData?.userId || 'your_user_id'}",
  "databaseId": "${graphData?.chatId || 'your_database_id'}"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example Usage and Documentation */}
      <div id="documentation" className="p-8">
        <h2 className="text-xl font-bold">Example usage (Natural Language Query)</h2>
        <div className="bg-[#1E1E1E] rounded-lg text-sm mt-4 w-full">
          <div className="flex border-b border-gray-700">
            {Object.keys(exampleCode).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "bg-gray-800 text-blue-400"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab(tab as keyof typeof exampleCode)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4 w-full overflow-hidden">
            <pre className="text-gray-400 text-wrap ">
              {exampleCode[activeTab]}
            </pre>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold">Documentation</h2>
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
            <h3 className="font-bold">How to Query Subindexes</h3>
            <p className="text-gray-400 mt-2">
              Query Subindexes using multiple languages.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
            <h3 className="font-bold">Querying Best Practices</h3>
            <p className="text-gray-400 mt-2">
              Learn how to optimize queries made from your application.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
            <h3 className="font-bold">Understanding Schema & Data Structure</h3>
            <p className="text-gray-400 mt-2">
              Learn how subindex schemas are structured and how to interpret the
              data they return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subindex;

