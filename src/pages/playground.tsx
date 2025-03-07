import { Link } from "react-router";
import Navbar from "./_component/navbar";
import IMAGES from "../assets/images";
import { useState } from "react";

const tags = [
  "Track DeFi transactions",
  "Index smart contract events",
  "Monitor NFT sales",
];

function Playground() {
  const [selectedTag, setSelectedTag] = useState("");
  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <Link to="#" className="flex items-center gap-2 text-[#C6C8CF] mb-16">
        <img
          src={IMAGES.help_circle}
          className="w-4 cursor-pointer"
          alt="help_circle"
        />
        Help
      </Link>
      <div className="flex gap-12">
        <div className="w-1/6 bg-[#1E1E1E] p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={IMAGES.logo} className="w-6" alt="logo" />
              AI Name
            </div>
            <img
              src={IMAGES.search}
              className="w-4 cursor-pointer"
              alt="search"
            />
          </div>
        </div>
        <div className="w-3/6">
          <div className="font-bold text-right mb-4">User Query</div>
          <img src={IMAGES.logo} className="w-6 mb-4" alt="logo" />
          <div className="text-[#7A7A7E] bg-[#1E1E1E] p-5 rounded-lg">
            This is an example of a response given or provided by this AI
            chatbot. Responses are liable to be awesome! This is an example of a
            response given or provided by this AI chatbot. Responses are liable
            to be awesome! This is an example of a response given or provided by
            this AI chatbot. Responses are liable to be awesome!This is an
            example of a response given or provided by this AI chatbot.
            Responses are liable to be awesome!This is an example of a response
            given or provided by this AI chatbot. Responses are liable to be
            awesome!This is an example of a response given or provided by this
            AI chatbot. Responses are liable to be awesome!This is an example of
            a response given or provided by this AI chatbot. Responses are
            liable to be awesome! This is an example of a response given or
            provided by this AI chatbot. Responses are liable to be awesome!
            This is an example of a response given or provided by this AI
            chatbot. Responses are liable to be awesome! This is an example of a
            response given or provided by this AI chatbot. Responses are liable
            to be awesome! This is an example of a response given or provided by
            this AI chatbot. Responses are liable to be awesome! This is an
            example of a response given or provided by this AI chatbot.
            Responses are liable to be awesome! This is an example of a response
            given or provided by this AI chatbot. Responses are liable to be
            awesome!
          </div>

          <div className="relative w-full mt-6">
            <textarea
              className="w-full h-48 bg-[#1E1E1E] text-white p-4 rounded-lg focus:outline-none resize-none"
              placeholder="Input Query"
              // value={description}
              // onChange={(e) => setDescription(e.target.value)}
            />
            <img
              src={IMAGES.send_button}
              alt={"send_button"}
              className="absolute bottom-5 right-5 h-8 cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-1.5 text-xs rounded-full border border-[#7A7A7E] text-[#7A7A7E] hover:border-white/70 hover:text-white/70 ${
                  selectedTag === tag ? "border-white" : ""
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="w-2/6 flex flex-col  bg-[#1E1E1E] p-5 rounded-lg">
          <div className="flex items-start justify-between gap-2 ">
            <h2 className=" font-semibold text-white">Schema Preview</h2>
            <button className="flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 px-2 py-1 rounded-md">
              <div className="text-white">JSON</div>
              <img src={IMAGES.exchange} alt={"exchange"} className="h-4" />
            </button>
          </div>
          <div className="flex-1" />
          <div className="flex items-start justify-between gap-2 ">
            <div className="hover:bg-white/10 rounded-lg cursor-pointer p-1.5">
              <img src={IMAGES.copy} className="w-4" alt="copy" />
            </div>
            <button className="flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 px-2 py-1 rounded-md">
              <div className="text-white">Export</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;
