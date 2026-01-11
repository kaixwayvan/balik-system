import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import BALIKLogo from "../assets/BALIK.png";

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-white-900 to-red-900 text-white">
      {/* Clickable logo */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer mb-6 flex items-center justify-center"
      >
        {/* Placeholder for BALIK logo */}
        <Link to="/">
          <img src={BALIKLogo} className="h-72 mb-6 mx-auto" alt="BALIK Logo" />
        </Link>
      </div>

      {/* Page ongoing message */}
      <p className="text-xl font-semibold">This page is ongoing...</p>
    </div>
  );
}
