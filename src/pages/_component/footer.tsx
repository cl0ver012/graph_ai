import IMAGES from "../../assets/images";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between flex-wrap text-white text-opacity-50 text-sm mt-24 p-6 ">
      <div className="flex flex-wrap justify-center space-x-6 mb-6">
        {["Home", "Playground", "Privacy Policy", "Docs", "Community"].map(
          (link, index) => (
            <a key={index} href="#" className="hover:text-gray-300">
              {link}
            </a>
          )
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-4">
        {[
          "Status",
          "Testnet",
          "Privacy Policy",
          "Terms of Service",
          "Brand Assets",
          "Partnership Requests",
          "Forum",
          "Security",
        ].map((link, index) => (
          <a key={index} href="#" className="hover:text-gray-300">
            {link}
          </a>
        ))}
      </div>

      <div className="flex mt-4 flex-wrap gap-6 justify-center">
        {[
          IMAGES.github,
          IMAGES.twitter,
          IMAGES.threads,
          IMAGES.instagram,
          IMAGES.warpcast,
          IMAGES.discord,
          IMAGES.telegram,
          IMAGES.reddit,
          IMAGES.spotify,
          IMAGES.youtube,
          IMAGES.linkedin,
          IMAGES.mail,
        ].map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt="img"
            className="h-4 cursor-pointer"
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
