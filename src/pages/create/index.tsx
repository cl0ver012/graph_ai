import IMAGES from "../../assets/images";
import { Link } from "react-router";
import Providers from "./_components/providers";
import Input from "./_components/inputs";
import Chat from "./_components/chat";
import GraphSchemaPreview from "./_components/graphSchemaPreview";
import { useState } from "react";

const Create = () => {
  const [step, setStep] = useState(1);
  const [displayChat, setDisplayChat] = useState(false);
  const render = () => {
    switch (step) {
      case 1:
        return <Providers next={() => setStep(2)} />;

      case 2:
        return <Input next={() => setStep(3)} />;

      case 3:
        return (
          <div className="flex gap-10 h-[calc(100%-50px)]">
            <Chat displayChat={displayChat} setDisplayChat={setDisplayChat} />
            <GraphSchemaPreview displayChat={displayChat} />
          </div>
        );

      default:
        break;
    }
  };
  return (
    <div className="h-screen py-10 overflow-y-auto">
      <div className="w-full flex text-[#C6C8CF] gap-6 items-center mb-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={IMAGES.back} className="w-3" alt="back" /> Back to directory
        </Link>
        <Link to="#" className="flex items-center gap-2">
          <img src={IMAGES.help_circle} className="w-4" alt="help_circle" />
          Help
        </Link>
      </div>
      {render()}
    </div>
  );
};

export default Create;
