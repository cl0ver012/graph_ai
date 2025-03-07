import IMAGES from "../../../../../assets/images";

function Schema() {
  const imageList = [
    {
      src: IMAGES.document,
      alt: "document",
      tip: "Show Documentation Explorer",
    },
    { src: IMAGES.history, alt: "history", tip: "Show History" },
    { src: IMAGES.explorer, alt: "explorer", tip: "Show GraphiQL" },
  ];

  const imageList2 = [
    { src: IMAGES.exchange, alt: "exchange", tip: "Refetch GraphQL schema" },
    { src: IMAGES.shortcut, alt: "shortcut", tip: "Open short keys dialog" },
  ];

  return (
    <div className="relative flex flex-1 min-h-96">
      <div className="bg-[#1B1A1A] flex-1 rounded-lg"></div>
      <div className="absolute md:relative bottom-5 md:bottom-auto flex flex-row md:flex-col p-2 justify-between gap-4">
        <div className="flex flex-row md:flex-col gap-4">
          {imageList.map((img, index) => (
            <div
              key={index}
              className="group relative hover:bg-[#1B1A1A] cursor-pointer p-1.5 rounded-lg"
            >
              <img src={img.src} alt={img.alt} className="h-5 md:h-auto w-5" />
              <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 scale-0 transition-all duration-200 group-hover:scale-100 bg-gray-800 text-white text-xs px-3 py-2 whitespace-nowrap rounded-md shadow-lg">
                {img.tip}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-row md:flex-col gap-4">
          {imageList2.map((img, index) => (
            <div
              key={index}
              className="group relative hover:bg-[#1B1A1A] cursor-pointer p-1.5 rounded-lg"
            >
              <img src={img.src} alt={img.alt} className="h-5 md:h-auto w-5" />
              <span className="absolute left-1/2 whitespace-nowrap -top-8 transform -translate-x-1/2 scale-0 transition-all duration-200 group-hover:scale-100 bg-gray-800 text-white text-xs px-3 py-2 rounded-md shadow-lg">
                {img.tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Schema;
