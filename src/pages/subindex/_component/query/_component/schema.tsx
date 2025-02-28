import IMAGES from "../../../../../assets/images";

function Schema() {
  return (
    <div className="relative flex  flex-1 min-h-96">
      <div className="bg-[#1B1A1A] flex-1 rounded-lg"></div>
      <div className="absolute md:relative bottom-5 md:bottom-auto  flex flex-row md:flex-col p-2 justify-between gap-4">
        <div className="flex flex-row md:flex-col gap-4">
          <img
            src={IMAGES.document}
            alt={"document"}
            className="h-5 md:h-auto w-5 "
          />
          <img
            src={IMAGES.history}
            alt={"history"}
            className="h-5 md:h-auto w-5 "
          />
          <img
            src={IMAGES.explorer}
            alt={"explorer"}
            className="h-5 md:h-auto w-5 "
          />
        </div>

        <div className=" flex flex-row md:flex-col gap-4">
          <img
            src={IMAGES.exchange}
            alt={"exchange"}
            className="h-5 md:h-auto w-5 "
          />
          <img
            src={IMAGES.shortcut}
            alt={"shortcut"}
            className="h-5 md:h-auto w-5 "
          />
        </div>
      </div>
    </div>
  );
}

export default Schema;
