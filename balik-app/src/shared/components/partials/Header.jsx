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
            to="/about-us"
            className="font-extrabold text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            ABOUT
          </Link>
          <Link
            to="/#footer"
            className="font-extrabold text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            CONTACT
          </Link>
          <Link
            to="/#faq"
            className="font-extrabold text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            LEARN MORE
          </Link>
          <Link
            to="/login"
            className="font-bold text-[#7B1C1C] border-2 border-[#7B1C1C] px-8 py-2.5 rounded-full hover:bg-[#7B1C1C] hover:text-white hover:shadow-lg hover:shadow-[#7B1C1C]/20 transition-all active:scale-95 duration-300 uppercase tracking-wide text-sm"
          >
            LOG IN
          </Link>



        </div>
      </nav>
    </header>
  );
}

export default Header;
