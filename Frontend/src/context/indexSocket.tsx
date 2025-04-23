"use client";

import React, { createContext, useContext, useRef, useState } from "react";

interface IWebSocketContext {
  connect: (params: WebSocketParams) => void;
  disconnect: () => void;
  sendMessage: (msg: string) => void;
  messages: WebSocketMessage[];
  connected: boolean;
}

interface WebSocketParams {
  userID: string;
  dbName: string;
  network: string;
  membership: string;
}

export interface WebSocketMessage {
  type: "SYSTEM" | "INCOMING" | "OUTGOING" | "ERROR";
  message: string;
}

export interface GraphNode {
  id: string;
  name: string;
  type: "central" | "regular";
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: GraphNode | string;
  target: GraphNode | string;
}

const WebSocketContext = createContext<IWebSocketContext | undefined>(
  undefined
);
export const apiURL = process.env.NEXT_PUBLIC_API_URL;
export const socketEndpoint = process.env.NEXT_PUBLIC_ENDPOINT;
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const latestParams = useRef<WebSocketParams | null>(null);

  const appendMessage = (type: WebSocketMessage["type"], message: string) => {
    setMessages((prev) => [
      ...prev,
      { type, message, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const connect = ({
    userID,
    dbName,
    network,
    membership,
  }: WebSocketParams) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      //   appendMessage("SYSTEM", "Already connected!");
      return;
    }

    const url = `wss://${socketEndpoint}/ws/${userID}/${dbName}/${network}/${"free"}`;
    const ws = new WebSocket(url);
    websocketRef.current = ws;
    latestParams.current = { userID, dbName, network, membership };

    ws.onopen = () => {
      //   appendMessage("SYSTEM", "Neural link established");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      appendMessage("INCOMING", event.data);
      sendChatToBackend(
        latestParams.current?.dbName || "",
        "INCOMING",
        event.data,
        latestParams.current?.userID || ""
      );
    };

    ws.onclose = (data) => {
      //   appendMessage("SYSTEM", "Neural link terminated");
      console.error("WebSocket error:", data);
      setConnected(false);
    };

    ws.onerror = (data) => {
      console.error("WebSocket error:", data);
      //   appendMessage("ERROR", "Neural link malfunction");
      setConnected(false);
    };
  };

  const disconnect = () => {
    const { userID, dbName } = latestParams.current || {};
    if (!websocketRef.current || !userID || !dbName) return;

    fetch(
      `https://${socketEndpoint}/admin/close-connection/${userID}:${dbName}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to close connection");
        return res.json();
      })
      .then(() => {
        websocketRef.current?.close();
        latestParams.current = null;
        setConnected(false);
        setMessages([]);
      })
      .catch((err) => {
        appendMessage("ERROR", `Failed to disconnect: ${err.message}`);
        websocketRef.current?.close();
      });
  };

  const sendMessage = (message: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(message);
      appendMessage("OUTGOING", message);
      appendMessage("SYSTEM", "Thinking...");
      sendChatToBackend(
        latestParams.current?.dbName || "",
        "OUTGOING",
        message,
        latestParams.current?.userID || ""
      );
    }
  };

  const sendChatToBackend = async (
    chatId: string,
    type: string,
    message: string,
    userId: string
  ) => {
    try {
      const response = await fetch(`${apiURL}/chats/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, type, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send chat data to the backend");
      }
    } catch (error) {
      console.error("Error saving chat to backend:", error);
    }
  };

  // Cleanup on unload
  //   useEffect(() => {
  //     const handleUnload = () => {
  //       const { userID, dbName } = latestParams.current || {};
  //       if (userID && dbName) {
  //         navigator.sendBeacon(
  //           `https://${process.env.NEXT_PUBLIC_ENDPOINT}/admin/close-connection/${userID}:${dbName}`
  //         );
  //       }

  //       websocketRef.current?.close();
  //     };

  //     window.addEventListener("beforeunload", handleUnload);
  //     return () => {
  //       window.removeEventListener("beforeunload", handleUnload);
  //     };
  //   }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connect,
        disconnect,
        sendMessage,
        messages,
        connected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
