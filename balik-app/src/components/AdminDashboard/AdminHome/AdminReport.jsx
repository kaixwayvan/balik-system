import { useState } from "react";
import { Link } from "react-router-dom";
import BALIKLogo from "../../../assets/BALIK.png";
import DatePicker from "react-datepicker";
import { IoNotifications } from "react-icons/io5";
import { User } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../shared/context/AuthContext";

export default function AdminReport() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [itemLost, setItemLost] = useState("");
  const [dateLost, setDateLost] = useState(null);
  const [file, setFile] = useState(null);
  const [reporterName, setReporterName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      reportType,
      category,
      brand,
      color,
      location,
      additionalInfo,
      itemLost,
      dateLost,
      file,
      reporterName,
      mobile,
      email,
    };

    // for backend stuff
    console.log("Form Submitted:", formData);
  };

  return (
    <>
      <header className="h-20 bg-white border-b flex items-center justify-between px-6">
        <div className="mt-6 font-semibold text-gray-700">
          <Link to="/">
            <img
              src={BALIKLogo}
              className="h-22 mb-6 mx-auto"
              alt="BALIK Logo"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="cursor-pointer text-gray-500">
            <IoNotifications size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-gray-50" />
              )}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user?.user_metadata?.full_name || "System Admin"}</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-800">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-300 p-10">
          <h1 className="text-5xl font-extrabold font-[Cormorant] text-red-800 mb-1">
            Submit a Report
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Our Online Lost &amp; Found can help you find what you are looking
            for.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="reportType"
                    className="block text-sm font-medium mb-1"
                  >
                    Report Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reportType"
                    required
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select report type
                    </option>
                    <option value="Missing Item">Missing Item</option>
                    <option value="Found Item">Found Item</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-1"
                  >
                    Item Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    placeholder="Gucci / Louis Vuitton"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color
                    </label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="" disabled>
                        Select color
                      </option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Additional Information
                  </label>
                  <p className="text-xs text-gray-500 mb-1">
                    Please provide any additional details/description of your
                    item.
                  </p>
                  <textarea
                    rows="3"
                    placeholder="Please provide additional details or description."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 resize-none"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    What was Lost <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-1">
                    (Pen, Jacket, Smartphone, Wallet, etc.)
                  </p>
                  <input
                    type="text"
                    required
                    value={itemLost}
                    onChange={(e) => setItemLost(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date Lost <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-1">
                    Approximate date the item was lost or found.
                  </p>

                  <DatePicker
                    selected={dateLost}
                    onChange={(date) => setDateLost(date)}
                    placeholderText="Select date"
                    required
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Photo (Optional)
                  </label>

                  <div className="flex items-center w-full border rounded-md overflow-hidden">
                    <label className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 cursor-pointer font-medium">
                      Choose File
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                    <div className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100">
                      {file ? file.name : "No file chosen"}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <h2 className="text-blue-600 font-semibold text-lg mt-10 mb-4">
              Reporter’s Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-10">
              <Link to="/dashboard">
                <button
                  type="reset"
                  onClick={() => {
                    setReportType("");
                    setCategory("");
                    setBrand("");
                    setColor("");
                    setLocation("");
                    setAdditionalInfo("");
                    setItemLost("");
                    setDateLost(null);
                    setFile(null);
                    setReporterName("");
                    setMobile("");
                    setEmail("");
                  }}
                  className="cursor-pointer px-8 py-2 border rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="cursor-pointer px-10 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}