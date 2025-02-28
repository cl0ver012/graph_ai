import { useNavigate } from "react-router";
import IMAGES from "../../assets/images";

const Card = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/subindex/123")}
      className="bg-[#1E1E1E] p-6 rounded-lg w-full cursor-pointer hover:bg-white hover:bg-opacity-20"
    >
      <div className="flex justify-between items-center text-xs text-[#585858]">
        <div className="flex items-center gap-1">
          <div className="bg-green-400 w-2 h-2 rounded-full" /> Live
        </div>
        <span className="">Powered by QuickNode</span>
      </div>
      <h2 className="text-xl text-[#C6C8CF] font-semibold mt-4">
        Ethereum Transactions Subindex
      </h2>
      <p className="text-[#7A7A7E] text-sm mt-4">
        Aggregates and indexes Ethereum transactions, allowing users to query by
        sender, receiver, amount, and timestamp.
      </p>
      <p className="text-[#7A7A7E] text-xs mt-4">Queried: 12.4k times.</p>
      <div className="text-[#7A7A7E] text-xs mt-10">
        <div className="flex items-center gap-2 mb-4">
          <p>Created by: 0x4D6a...B91F</p>
          <img src={IMAGES.copy} className="w-5" alt="copy" />
        </div>
        <p>Creation date: Jan 15, 2024</p>
      </div>
    </div>
  );
};

export default Card;
