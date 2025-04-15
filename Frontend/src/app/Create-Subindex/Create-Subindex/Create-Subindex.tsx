"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { socketEndpoint, useWebSocket } from "@/context/indexSocket";
import GenericViewer from "./GenericViewer";

const dataProviders = [
  { id: "sol", icon: "/Solana.png", name: "Solana" },
  { id: "evm", icon: "/Etherium.png", name: "Etherium" },
];

const CreateSubindex = () => {
  const router = useRouter();
  const { connect, connected, disconnect, messages, sendMessage } =
    useWebSocket();
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [activePreview, setActivePreview] = useState<"graph" | "schema">(
    "graph"
  );
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [htmlGraph, setHtmlGraph] = useState<string | null>(null);
  const [schema, setSchema] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    const fetchHtmlGraph = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://${socketEndpoint}/api/subgraph_html/${userId}/${currentChatId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await res.json();
        if (data.html) {
          setHtmlGraph(data.html);
        }
      } catch (error) {
        console.error(`Error fetching content`, error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSchema = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://${socketEndpoint}/api/subgraph/${userId}/${currentChatId}/schema`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await res.json();
        if (
          typeof data.schema === "string" &&
          data.schema.toLowerCase().startsWith("error")
        ) {
          throw data.schema;
        } else {
          setSchema(data.schema);
        }
      } catch (error) {
        console.error(`Error fetching content`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchHtmlGraph();
    fetchSchema();
  }, [messages]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (step === 1) {
        router.back();
        return;
      }
      e.preventDefault();
      setShowModal(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]);

  const renderPreview = () => {
    const containerStyles = `h-[30rem] overflow-auto`;
    const scrollbarStyles = {
      scrollbarWidth: "thin" as "auto" | "thin" | "none", // For Firefox
      scrollbarColor: "#4a4a4a transparent", // Thumb and track color for Firefox
    };

    return (
      <div style={scrollbarStyles}>
        <style jsx>{`
          /* For Webkit browsers (Chrome, Safari) */
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-thumb {
            background-color: #4a4a4a;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
        `}</style>
        {(() => {
          switch (activePreview) {
            case "graph":
              return (
                <div>
                  <GenericViewer
                    content={htmlGraph}
                    type="html"
                    loading={loading}
                  />
                </div>
              );
            case "schema":
              return (
                <div className={`text-white ${containerStyles}`}>
                  <GenericViewer
                    content={schema}
                    type="text"
                    loading={loading}
                  />
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  function generateUniqueDbName(prefix = "cat0x") {
    const now = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 10);

    const name = `${prefix}${now}${random}`;

    // Enforce length limit of 63 characters
    return name.slice(0, 15);
  }

  const handleConnect = () => {
    const newChatId = generateUniqueDbName();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID is missing, connect wallet");
      return;
    }
    connect({
      userID: userId,
      dbName: newChatId,
      network: selectedProvider!,
      membership: "free",
    });
    setCurrentChatId(newChatId);
    console.log("New Chat ID:", newChatId);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    sendMessage(userMessage);
    setInput("");
  };

  const [creating, setCreating] = useState(false);

  const handleNavigation = async () => {
    if (!currentChatId) {
      alert("Graph Data or Chat ID is missing");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID is missing, connect wallet");
      return;
    }

    try {
      setCreating(true);
      const response = await fetch(`${apiURL}/graphdata/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          chatId: currentChatId,
          selectedProvider: dataProviders.find(
            (provider) => provider.id === selectedProvider
          )?.name,
          chats: messages,
        }),
      });

      if (!response.ok) throw new Error("Failed to store Graph Data");

      const data = await response.json();

      console.log("Graph Data stored successfully!");
      disconnect();

      router.push(`/Subindex?id=${data._id}`);
    } catch (error) {
      console.error("Error storing Graph Data:", error);
    } finally {
      setCreating(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#121212] text-white p-12">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            className="text-gray-400 hover:text-white"
            onClick={handleBack}
          >
            ← {step === 1 ? "Home" : "Back to directory"}
          </button>
          <button className="text-gray-400 hover:text-white">Help</button>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold text-gray-900">Warning</h2>
              <p className="text-gray-700 mt-2">
                If you go back, all your current chats and data will be lost.
                Are you sure you want to continue?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-900 text-white hover:bg-slate-500 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setStep(1);
                    disconnect();
                  }}
                  className="bg-red-600 text-white hover:bg-red-500 py-2 px-4 rounded-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 ? (
          // Step 1: Select Data Provider
          <div>
            <h2 className="text-xl font-bold mt-28">Select Chain</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-6">
              {dataProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`bg-[#1E1E1E] p-10 sm:p-16 flex justify-center items-center rounded-3xl cursor-pointer border-2 
                        ${
                          selectedProvider === provider.id
                            ? "border-blue-500"
                            : "border-transparent"
                        } hover:border-gray-500`}
                  onClick={() => {
                    setSelectedProvider(provider.id);
                  }}
                >
                  <Image
                    src={provider.icon}
                    alt={provider.name}
                    width={96}
                    height={40}
                    className="w-20 h-8 sm:w-24 sm:h-10"
                  />
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              className={`mt-10 px-6 py-3 bg-gray-600 text-white rounded-lg 
                ${
                  selectedProvider !== null
                    ? "hover:bg-gray-400"
                    : "opacity-50 cursor-not-allowed"
                }`}
              disabled={selectedProvider === null}
              onClick={() => {
                setStep(2);
                handleConnect();
              }}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="mt-28 flex flex-col lg:flex-row gap-6 w-full mx-auto transition-all duration-500">
            {/* Chat Section */}
            <div
              className={`bg-[#1E1E1E] p-6 rounded-3xl flex-1 min-w-[300px] transition-all duration-500`}
            >
              <div className="text-white text-lg font-bold mb-4">
                Hi! Let’s create your subindex.
              </div>
              <span
                className={`${connected ? "text-green-500" : "text-red-500"}`}
              >
                {connected ? "Connected" : "Disconnected"}
              </span>
              <p className="text-gray-400 mb-4">
                What type of data do you want to index?
              </p>

              {/* Chat History */}
              <div
                ref={containerRef}
                className="h-80 lg:h-96 overflow-y-auto space-y-4 custom-scrollbar px-4"
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.type === "OUTGOING" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.type !== "OUTGOING" && (
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center mb-1 space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                            🤖 {/* AI Icon */}
                          </div>
                        </div>
                        <div className="max-w-[70%] bg-[#3A3A3A] text-white p-3 rounded-lg break-words text-sm leading-relaxed">
                          {msg.message}
                        </div>
                      </div>
                    )}
                    {msg.type === "OUTGOING" && (
                      <div className="flex flex-col items-end w-full">
                        <div className="max-w-[75%] bg-[#2D2D2D] text-white p-3 rounded-lg text-sm leading-relaxed">
                          {msg.message}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chatbox */}
              <div className="relative mt-4">
                <textarea
                  className="w-full bg-[#2E2E2E] text-white p-4 rounded-xl focus:outline-none resize-none"
                  placeholder="Describe your subindex requirements"
                  rows={3}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                {/* Arrow Send Button */}
                {input.trim() && (
                  <button
                    onClick={handleSendMessage}
                    disabled={!connected}
                    className="absolute bottom-4 right-4 bg-gray-600 p-2 rounded-full hover:bg-gray-500 transition disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ➤
                  </button>
                )}
              </div>

              {/* Suggested Messages (Disappear after first message) */}
              {messages.length === 0 && (
                <div className="flex space-x-3 mt-4">
                  {[
                    "Track DeFi transactions",
                    "Index smart contract events",
                    "Monitor NFT sales",
                  ].map((text, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-[#333] text-gray-300 rounded-lg text-sm hover:bg-[#444] "
                      onClick={() => {
                        setInput(text);
                        handleSendMessage();
                      }}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Graph Section */}
            {(schema || htmlGraph) && (
              <div
                className={`bg-[#1E1E1E] p-6 rounded-3xl shadow-xl border border-gray-700 flex flex-col transition-all duration-500 lg:w-[50%] min-w-[300px]`}
              >
                <div className="text-white text-lg font-bold mb-4">
                  Schema Preview
                </div>
                <div className="flex space-x-4 text-gray-400 text-sm mb-4">
                  <button
                    onClick={() => setActivePreview("graph")}
                    className={`${
                      activePreview === "graph"
                        ? "text-white"
                        : "hover:text-white"
                    } transition`}
                  >
                    Graph
                  </button>
                  <button
                    onClick={() => setActivePreview("schema")}
                    className={`${
                      activePreview === "schema"
                        ? "text-white"
                        : "hover:text-white"
                    } transition`}
                  >
                    Table
                  </button>
                </div>

                <div className="flex-1 bg-black rounded-lg p-4 relative max-h-[400px] overflow-auto">
                  {renderPreview()}
                  <button className="absolute top-[-30px] right-1 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                    JSON
                  </button>
                </div>
                <button
                  onClick={handleNavigation}
                  className="mt-4 bg-blue-500 text-white py-2 rounded-lg font-bold"
                  disabled={creating}
                >
                  {creating ? "Deploying..." : "Deploy"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a4a4a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </>
  );
};

export default CreateSubindex;
