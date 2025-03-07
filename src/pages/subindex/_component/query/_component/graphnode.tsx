import { useState } from "react";
import IMAGES from "../../../../../assets/images";

const graphData = {
  graph: {
    nodes: [
      {
        id: "ethereum_transactions_subindex",
        label: "Ethereum Transactions Subindex",
        type: "subindex",
        color: "orange",
      },
      {
        id: "transaction_id",
        label: "Transaction ID",
        type: "attribute",
        data_type: "String",
      },
      {
        id: "wallet_address",
        label: "Wallet Address",
        type: "attribute",
        data_type: "String",
      },
      {
        id: "amount",
        label: "Amount",
        type: "attribute",
        data_type: "Float",
      },
    ],
  },
};

const GraphNodes = () => {
  const [expanded, setExpanded] = useState<boolean[]>(
    new Array(graphData.graph.nodes.length).fill(true)
  );

  const toggleExpand = (index: number) => {
    setExpanded((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  return (
    <div className="relative flex-1 max-w-3xl border border-[#585858] p-6 rounded-lg ">
      <img
        src={IMAGES.preview}
        className="w-8 absolute top-5 right-5 cursor-pointer"
        alt="preview"
      />

      <pre className="p-4 rounded-lg text-sm overflow-x-auto">
        {"{"}
        <div className="ml-4">
          <span className="text-[#FF514B]">"graph"</span>: {"{"}
          <div className="ml-4">
            <span className="text-[#FF514B]">"nodes"</span>: [
            {graphData.graph.nodes.map((node, index) => (
              <div key={node.id} className="ml-4">
                <button
                  onClick={() => toggleExpand(index)}
                  className="flex items-center hover:underline cursor-pointer"
                >
                  {/* {expanded[index] ? <FiChevronDown /> : <FiChevronRight />}{" "} */}
                  {"{"}
                </button>
                {expanded[index] && (
                  <div className="ml-6">
                    {Object.entries(node).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-[#FF514B]">"{key}"</span>:{" "}
                        <span className="text-[#33FFCC]">"{value}"</span>,
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-white">{"}"},</span>
              </div>
            ))}
            ]
          </div>
          {"}"}
        </div>
        {"}"}
      </pre>
    </div>
  );
};

export default GraphNodes;
