import GraphNodes from "./_component/graphnode";
import QuickStart from "./_component/quickstart";
import Schema from "./_component/schema";

function Query() {
  return (
    <div>
      <div className="flex flex-col md:flex-row border border-[#FFFFFF14] rounded-lg gap-6 p-4 md:p-6 mb-10">
        <GraphNodes />
        <Schema />
      </div>
      <QuickStart />
    </div>
  );
}

export default Query;
