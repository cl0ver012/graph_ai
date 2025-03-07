// import { useNavigate } from "react-router";
import Navbar from "../_component/navbar";
import Footer from "../_component/footer";
import IMAGES from "../../assets/images";
import Query from "./_component/query";
import { useState } from "react";
import SingleSelect from "../_component/singleSelect";
import { Link } from "react-router";

const Subindex = () => {
  const [activeTab, setActiveTab] = useState("Querry");
  return (
    <div className=" min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between pt-20 text-[#7A7A7E]">
        <div className="">
          <div className="flex items-center gap-2 mb-4">
            <img src={IMAGES.index} className="w-4" alt="index" />
            0x4D6a...B91F
            <img src={IMAGES.copy} className="w-4 cursor-pointer" alt="copy" />
          </div>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold text-white text-opacity-85">
                Ethereum Transactions Subindex
              </h1>
              <p className=" text-white text-opacity-50">
                Aggregates and indexes Ethereum transactions, allowing users to
                query by sender, receiver, amount, and timestamp.
              </p>
            </div>
            <SingleSelect options={[{ label: "v0.03", value: "0.03" }]} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <img src={IMAGES.warning} className="w-3" alt="warning" />
              <div>Queries: 12.4k</div>
            </div>
            |<p className="">Updated a year ago</p>
          </div>
        </div>
        <Link
          to="/playground"
          className="mt-6 px-6 py-3 h-10 flex items-center bg-white bg-opacity-10 rounded-lg  text-white text-opacity-85 hover:bg-white hover:bg-opacity-20"
        >
          Text Index
        </Link>
      </div>

      <div className="flex items-start flex-wrap gap-4 mt-8">
        <div className="space-y-1">
          <div className="uppercase text-white text-opacity-65 text-xs">
            Provider
          </div>
          <div className="text-white text-opacity-90 max-w-32 text-ellipsis whitespace-normal overflow-x-hidden">
            QuickNode
          </div>
        </div>
        <div className="w-[1px] h-8 bg-white bg-opacity-20" />

        <div className="space-y-1">
          <div className="uppercase text-white text-opacity-65 text-xs">
            Query Endpoint
          </div>

          <div className="flex items-center gap-2">
            <div className="text-white text-opacity-90 max-w-32 text-ellipsis whitespace-normal overflow-x-hidden">
              https://api.GraphRAG.com/subindexes/name/ethereum/
            </div>
            <img src={IMAGES.copy} className="w-4 cursor-pointer" alt="copy" />
          </div>
        </div>
        <div className="w-[1px] h-8 bg-white bg-opacity-20" />
        <div className="space-y-1">
          <div className="uppercase text-white text-opacity-65 text-xs">
            GraphQL Playground Link
          </div>

          <div className="flex items-center gap-2">
            <div className="text-white text-opacity-90 max-w-32 text-ellipsis whitespace-normal overflow-x-hidden">
              https://playground.graphrag.io/subgraphs/name/ethereum/transactions
            </div>
            <img src={IMAGES.copy} className="w-4 cursor-pointer" alt="copy" />
          </div>
        </div>
        <div className="w-[1px] h-8 bg-white bg-opacity-20" />
        <div className="">
          <div className="flex items-center gap-2">
            <div className="uppercase text-white text-opacity-65 text-xs">
              Query Documentation
            </div>
            <img
              src={IMAGES.arrow_up_right}
              className="w-4 cursor-pointer"
              alt="arrow_up_right"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 py-20">
        <div className="flex items-center bg-[#4BCA8114] border border-[#4BCA8129] rounded-full px-4 p-1 gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 text-xs" />
          LIVE
        </div>
        <div className="flex-1 h-[1px] bg-[#4BCA8152]" />
        <div>
          <div className="flex items-center gap-2">
            <div className="uppercase text-xs text-white text-opacity-65">
              Progress
            </div>
            <img src={IMAGES.info} className="w-4 cursor-pointer" alt="info" />
          </div>
          <div className="text-white text-opacity-90 ">100%</div>
        </div>
      </div>

      <div className="flex border-b border-white border-opacity-15 bg-[#FFFFFF05] mb-14">
        {["Querry", "About", "Indexer", "Curators"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm hover:text-white ${
              activeTab === tab
                ? "border-b-2 border-[#6F4CFF] text-white"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Query />
      <Footer />
    </div>
  );
};

export default Subindex;
