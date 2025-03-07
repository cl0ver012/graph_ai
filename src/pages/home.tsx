import { useNavigate } from "react-router";
import IMAGES from "../assets/images";
import Card from "./_component/card";
import Footer from "./_component/footer";
import Navbar from "./_component/navbar";
import PoweredBy from "./_component/powerBy";
import CustomSelect from "./_component/customSelect";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className=" min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-white text-opacity-85">
            Explore Decentralized Subindexes
          </h1>
          <p className="mt-4 text-white text-opacity-50">
            Discover, search, and interact with AI-powered subindexes. Easily
            find the data you need or create your own custom subindex in just a
            few clicks.
          </p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="mt-6 px-6 py-3 h-14 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 text-white text-opacity-85"
        >
          Create Subindex
        </button>
      </div>
      <div className="flex flex-col md:flex-row  md:items-center mt-6 gap-4">
        <div className="flex items-center justify-between px-2  md:px-6  flex-1 max-w-xl bg-[#1E1E1E] hover:bg-white hover:bg-opacity-20 rounded-full">
          <input
            type="text"
            placeholder="Search by name, description, creator..."
            className="px-4 py-2 flex-1 outline-none bg-transparent text-[#7A7A7E]"
          />
          <img
            src={IMAGES.search}
            className="w-5 cursor-pointer"
            alt="search"
          />
        </div>
        <CustomSelect
          options={[
            { label: "Ethereum", value: "ethereum" },
            { label: "Others", value: "others" },
          ]}
          placeholder="Search"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10 ">
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} />
        ))}
      </div>
      <div className="flex flex-col items-center">
        <button className="bg-[#1E1E1E] text-[#C6C8CF] px-6 py-2 rounded-md mt-6 bg-opacity-50 hover:bg-opacity-100">
          Load More
        </button>
        <p className="text-[#585858] text-xs mt-4">
          Showing 20 of 16,251 Subindexes
        </p>
      </div>
      <PoweredBy />
      <Footer />
    </div>
  );
};

export default Home;
