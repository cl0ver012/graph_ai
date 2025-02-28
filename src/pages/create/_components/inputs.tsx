import { useState } from "react";
import IMAGES from "../../../assets/images";

const Input = ({ next }: { next: () => void }) => {
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = [
    "Track DeFi transactions",
    "Index smart contract events",
    "Monitor NFT sales",
  ];

  return (
    <div className="h-[calc(100%-50px)] w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="mb-4">
          <img src={IMAGES.logo} alt={"logo"} className="h-5" />
        </div>

        <p className="text-[#C6C8CF] text-base mt-2">
          Hi! Let’s create your subindex. What type of data do you want to
          index?
        </p>

        <div className="relative w-full mt-6">
          <textarea
            className="w-full h-48 bg-[#1E1E1E] text-white p-4 rounded-lg focus:outline-none resize-none"
            placeholder="Describe your subindex requirements"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <img
            src={IMAGES.send_button}
            alt={"send_button"}
            onClick={next}
            className="absolute bottom-5 right-5 h-8 cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-4 py-1.5 text-xs rounded-full border border-[#7A7A7E] text-[#7A7A7E] ${
                selectedTag === tag ? "border-white" : ""
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Input;
