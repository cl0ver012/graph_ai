import { useState } from "react";
import IMAGES from "../../../assets/images";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chat = ({
  displayChat,
  setDisplayChat,
}: {
  displayChat: boolean;
  setDisplayChat: (value: boolean) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "This is an example of a response given or provided by this AI chatbot. Responses are liable to be awesome!",
      sender: "ai",
    },
    {
      text: "This is an example of a prompt given or provided by a user. Prompts are liable to be awesome!",
      sender: "user",
    },
    {
      text: "This is an example of a response given or provided by this AI chatbot. Responses are liable to be awesome!",
      sender: "ai",
    },
    {
      text: "This is an example of a prompt given or provided by a user. Prompts are liable to be awesome!",
      sender: "user",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div
      className={`
      ${!displayChat ? "flex" : "hidden md:flex"}
       flex-1  flex-col`}
    >
      <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="">
              {msg.sender === "ai" && (
                <img src={IMAGES.logo} alt={"logo"} className="h-5 mb-2" />
              )}
              <div
                className={`p-4 rounded-lg max-w-xs bg-[#1E1E1E] text-[#7A7A7E]`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative w-full mt-6">
        <textarea
          className="w-full h-48 bg-[#1E1E1E] text-[#7A7A7E] p-4 rounded-lg focus:outline-none resize-none"
          placeholder="Describe your subindex requirements"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <img
          src={IMAGES.send_button}
          alt={"send_button"}
          className="absolute bottom-5 right-5 h-8"
        />
        <div
          onClick={() => setDisplayChat(!displayChat)}
          className="absolute left-5 bottom-5 flex flex-col text-center items-center"
        >
          <img src={IMAGES.computer} alt={"computer"} className="w-5 " />
          Schema <br /> Preview
        </div>
      </div>
    </div>
  );
};

export default Chat;
