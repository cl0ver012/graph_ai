import { useState } from "react";
import IMAGES from "../../../assets/images";

const providers = [
  { name: "QuickNode", logo: IMAGES.quicknode_logo },
  { name: "Ankr", logo: IMAGES.ankr_logo },
  { name: "OtherProvider", logo: IMAGES.infura_logo },
  { name: "Moralis", logo: IMAGES.moralis_logo },
  { name: "Alchemy", logo: IMAGES.alchemy_logo },
];

function Providers({ next }: { next: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="">
        <h1 className="text-2xl font-semibold">Create New Subindex</h1>
        <p className="text-white text-opacity-50 max-w-lg mt-2">
          Use our AI assistant to generate a custom subindex based on your
          needs. Select a data provider and refine your schema effortlessly.
        </p>
      </div>

      <div className="mt-20">
        <h2 className="text-lg font-medium text-[#C6C8CF]">
          Select Data Provider
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4 p-2">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className={`w-36 h-36 flex items-center justify-center bg-[#1E1E1E] rounded-lg cursor-pointer transition ${
                selected === provider.name
                  ? "ring-2 ring-white"
                  : "hover:bg-white/20"
              }`}
              onClick={() => setSelected(provider.name)}
            >
              <img src={provider.logo} alt={provider.name} className="h-16" />
            </div>
          ))}
        </div>
      </div>

      <button
        className={`mt-8 px-6 py-2 rounded-md bg-white bg-opacity-10 hover:bg-white/20 `}
        disabled={!selected}
        onClick={next}
      >
        Next
      </button>
    </div>
  );
}

export default Providers;
