// import { useEffect, useRef } from "react";
import IMAGES from "../../../assets/images";
// import { Network } from "vis-network/standalone";

const GraphSchemaPreview = ({ displayChat }: { displayChat: boolean }) => {
  // const containerRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if (!containerRef.current) return;

  //     const nodes = [
  //       { id: 1, label: "Central Node", color: "#f5a623", font: { color: "black" } },
  //       { id: 2, label: "Primary Attribute", color: "#32cd32" },
  //       { id: 3, label: "Primary Attribute", color: "#32cd32" },
  //       { id: 4, label: "Primary Attribute", color: "#32cd32" },
  //       { id: 5, label: "Metadata Node", color: "rgba(255,255,255,0.2)", font: { color: "white" } },
  //       { id: 6, label: "Metadata Node", color: "rgba(255,255,255,0.2)", font: { color: "white" } },
  //     ];

  //     const edges = [
  //       { from: 1, to: 2 },
  //       { from: 1, to: 3 },
  //       { from: 1, to: 4 },
  //       { from: 1, to: 5 },
  //       { from: 1, to: 6 },
  //     ];

  //     const network = new Network(containerRef.current, { nodes, edges }, {
  //       nodes: {
  //         shape: "dot",
  //         size: 20,
  //         font: { color: "#fff" },
  //       },
  //       edges: {
  //         color: "#666",
  //       },
  //       physics: {
  //         enabled: true,
  //       },
  //     });

  //     return () => network.destroy();
  //   }, []);

  return (
    <div
      className={`${
        displayChat ? "flex" : "hidden md:flex"
      } flex-1 h-full  bg-[#1E1E1E] text-[#7A7A7E] rounded-lg py-6 `}
    >
      <div className="text-xs space-y-5 p-2">
        <div className="flex flex-col text-center items-center">
          <img src={IMAGES.settings} alt={"settings"} className="w-5 " />
          Modify <br /> Schema
        </div>
        <div className="flex flex-col text-center items-center">
          <img src={IMAGES.undo} alt={"undo"} className="w-5 " />
          Undo
        </div>
        <div className="flex flex-col text-center items-center">
          <img src={IMAGES.settings} alt={"settings"} className="w-5 " />
          Preview
        </div>
      </div>
      <div className="flex flex-col flex-1 pr-6  ">
        <div className="flex items-start justify-between mb-4 gap-10">
          <div className="flex items-start gap-2 flex-1">
            <img src={IMAGES.star} alt={"star"} className="h-5 mt-1" />
            <div className="">
              <h2 className="text-lg font-semibold text-white">
                Schema Preview
              </h2>
              <p className="text-xs">
                This is a live preview of your subindex schema. Modify fields or
                refine details before deployment.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white bg-opacity-10 px-2 py-1 rounded-md">
            <div className="text-white">JSON</div>
            <img src={IMAGES.exchange} alt={"exchange"} className="h-4" />
          </button>
        </div>

        <div className="w-full bg-black flex-1 rounded-lg p-2 relative">
          <div className="absolute left-2 top-8 flex flex-col gap-5 text-xs">
            <div className="flex flex-col text-center items-center bg-[#1E1E1E] p-1 rounded">
              <img
                src={IMAGES.chart_relationship}
                alt={"chart_relationship"}
                className="w-5 "
              />
              Graph
            </div>
            <div className="flex flex-col text-center items-center">
              <img src={IMAGES.table} alt={"table"} className="w-5 " />
              Table
            </div>
            <div className="flex flex-col text-center items-center">
              <img src={IMAGES.text_font} alt={"text_font"} className="w-5 " />
              Font
            </div>
            <div className="flex flex-col text-center items-center">
              <img
                src={IMAGES.source_code}
                alt={"source_code"}
                className="w-5 "
              />
              Code
            </div>
          </div>
          <div className="absolute right-2 bottom-4 flex flex-col gap-4">
            <img src={IMAGES.search_add} alt={"search_add"} className="w-5 " />
            <img
              src={IMAGES.search_minus}
              alt={"search_minus"}
              className="w-5 "
            />
            <img src={IMAGES.text_font} alt={"text_font"} className="w-5 " />
            <img src={IMAGES.d_view} alt={"d_view"} className="w-5 " />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button className="flex items-center gap-2 bg-white text-white bg-opacity-10 px-4 py-2 rounded-md">
            Deploy
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphSchemaPreview;
