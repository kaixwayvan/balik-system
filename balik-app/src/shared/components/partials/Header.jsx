import { Link } from "react-router-dom";
import BALIKLogo from "../../../assets/BALIK.png";

function Header() {
  return (
    <header className="top-0 z-30">
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 font-zalando">
        {/* Logo */}
        <img src={BALIKLogo} alt="BALIK Logo" className="h-30" />

        {/* Links + Button */}
        <div className="flex items-center gap-15 font-['Zalando_Sans_Expanded']">
          <Link
            to="/"
            className="font-extrabold text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="font-extrabold text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            ABOUT
          </Link>
          <Link
            to="/contact"
            className="font-extrabold text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            CONTACT
          </Link>
          <Link
            to="/learnmore"
            className="font-extrabold text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            LEARN MORE
          </Link>
          <Link
            to="/login"
            className="font-extrabold text-[#cb7300ff] border-[1.5px] border-[#cb7300ff] px-6 py-2 rounded-3xl hover:bg-[#cb7300ff] hover:text-white transition-colors duration-300"
          >
            LOG IN
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
