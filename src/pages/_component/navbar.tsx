import { Link } from "react-router";
import IMAGES from "../../assets/images";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center space-x-4 text-opacity-65 text-white">
        <Link to="/">
          <img src={IMAGES.logo} className="w-6" alt="logo" />
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/playground" className="hover:text-gray-300">
            Playground
          </Link>
          <Link to="#" className="hover:text-gray-300">
            Docs
          </Link>
          <Link to="#" className="hover:text-gray-300">
            Community
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <img src={IMAGES.user} className="w-6" alt="user" />
        <img src={IMAGES.hamburger} className="w-8" alt="hamburger" />
        <button className="px-4 py-2 bg-white bg-opacity-10 text-opacity-85 rounded-lg text-white hidden md:block hover:bg-white hover:bg-opacity-20 ">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
