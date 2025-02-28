import IMAGES from "../../assets/images";

const PoweredBy = () => {
  const partners = [
    { name: "QuickNode", logo: IMAGES.quick_node },
    { name: "Alchemy", logo: IMAGES.alchemy },
    { name: "Moralis", logo: IMAGES.moralis },
    { name: "Ankr", logo: IMAGES.ankr },
    { name: "Infura", logo: IMAGES.infura },
  ];

  return (
    <div className="flex flex-col items-center space-y-4 mt-16">
      <p className="text-2xl font-semibold text-[#7A7A7E] mb-4">Powered by</p>
      <div className="flex flex-wrap justify-center gap-8">
        {partners.map((partner, index) => (
          <img
            key={index}
            src={partner.logo}
            alt={partner.name}
            className="h-8"
          />
        ))}
      </div>
    </div>
  );
};

export default PoweredBy;
