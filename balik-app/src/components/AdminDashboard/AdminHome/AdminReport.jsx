import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import { X, MapPin, ChevronDown, Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import ColorPicker from "../../../shared/components/ColorPicker";
import MapPicker from "../../../shared/components/MapPicker";

export default function AdminReport({ isOpen, initialType, onClose }) {
  const [reportType, setReportType] = useState("Missing Item");

  useEffect(() => {
    if (initialType) {
      setReportType(initialType);
    }
  }, [initialType, isOpen]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [itemLost, setItemLost] = useState("");
  const [dateLost, setDateLost] = useState(null);
  const datePickerRef = useRef(null);
  const [file, setFile] = useState(null);
  const [reporterName, setReporterName] = useState("Mike Wazowski");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // Map Picker Panel Visibility State
  const [showMap, setShowMap] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleReset = () => {
    setReportType(initialType || "Missing Item");
    setCategory("");
    setBrand("");
    setColor("");
    setLocation("");
    setAdditionalInfo("");
    setItemLost("");
    setDateLost(null);
    setFile(null);
    setMobile("");
    setEmail("");
    onClose();
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
    console.log("Form Submitted:", formData);
    onClose();
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto 
    transition-opacity duration-300 ease-out
    ${isOpen ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Main Modal Card Box */}
      <div
        className="relative bg-gradient-to-b from-[#FFFDFB] to-[#FFF5EA] w-full max-w-[92vw] sm:max-w-lg md:max-w-3xl lg:max-w-5xl rounded-3xl sm:rounded-4xl shadow-2xl flex flex-col my-auto max-h-[88vh] sm:max-h-[85vh] overflow-hidden border border-[#EBD2C4]/80 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Glow Blob 1 (Top Right) */}
          <div className="absolute -top-24 -right-24 w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#EBD2C4] to-[#FDBA74] opacity-30 sm:opacity-40 blur-2xl sm:blur-3xl" />
          
          {/* Glow Blob 2 (Bottom Left) */}
          <div className="absolute -bottom-20 -left-20 w-52 h-52 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[#FED7AA] to-[#EBD2C4] opacity-20 sm:opacity-30 blur-2xl sm:blur-3xl" />

          {/* Micro Grid Overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.08] sm:opacity-[0.10]"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="modalGrid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="#AD3218"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modalGrid)" />
          </svg>
        </div>

        {/* Header Block */}
        <div className="relative z-10 flex justify-between items-start px-3 pt-4 pb-1 sm:px-8 sm:pt-7 md:px-12 md:pt-8 xl:px-16 xl:pt-10 flex-shrink-0">
          <div className="text-left pl-1 lg:pl-0">
            <h2
              id="modal-title"
              className="text-lg sm:text-2xl md:text-3xl xl:text-4xl text-[#5E3609] font-black uppercase mt-0.5 tracking-normal"
            >
              {reportType === "Missing Item"
                ? "Report Lost Item"
                : "Report Found Item"}
            </h2>
            <p className="text-[11px] pb-1 sm:pb-2 md:text-sm xl:text-base text-[#755E4E] leading-relaxed font-semibold mt-0.5 mb-1 sm:mb-3">
              {reportType === "Missing Item"
                ? "Help us find your belongings by providing details."
                : "Return what you've found to its rightful owner."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 sm:p-2.5 text-slate-500 hover:text-slate-900 hover:bg-white/90 bg-white/60 backdrop-blur border border-slate-200/80 rounded-full transition active:scale-95 cursor-pointer shadow-sm relative z-50 mt-0.5 sm:mt-0 focus:outline-none focus:ring-2 focus:ring-amber-700 min-w-[34px] min-h-[34px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 overflow-y-auto px-2 pb-4 pt-1 sm:px-6 sm:pb-8 md:px-10 md:pb-8 xl:px-16 xl:pb-10 flex-1 space-y-4 sm:space-y-6 min-w-0"
        >
          {/* Glass Card Container for Input Legibility */}
          <div className="relative z-[50] bg-white/95 backdrop-blur-md p-3 sm:p-6 md:p-8 xl:p-10 rounded-2xl sm:rounded-3xl shadow-xl space-y-4 sm:space-y-6 border border-white/90">
            {/* Row 1: Type & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-[90]">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="reportType"
                  className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide"
                >
                  Report Type{" "}
                  <span className="text-red-600" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="reportType"
                    required
                    value={reportType}
                    onChange={(e) => {
                      setReportType(e.target.value);
                      setOpenDropdown(null);
                    }}
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "reportType" ? null : "reportType",
                      )
                    }
                    onBlur={() => setOpenDropdown(null)}
                    className="cursor-pointer appearance-none w-full p-2.5 sm:p-3.5 pr-10 sm:pr-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all min-h-[40px] sm:min-h-[46px]"
                  >
                    <option value="Missing Item">Missing Item</option>
                    <option value="Found Item">Found Item</option>
                  </select>

                  <ChevronDown
                    className={`
                      absolute right-3 sm:right-4 top-1/2
                      -translate-y-1/2
                      w-4 h-4 sm:w-5 sm:h-5 text-slate-500 pointer-events-none
                      transition-transform duration-300
                      ${openDropdown === "reportType" ? "rotate-180" : ""}
                    `}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="itemLost"
                  className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide"
                >
                  {reportType === "Missing Item"
                    ? "What was Lost"
                    : "What was Found"}{" "}
                  <span className="text-red-600" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="itemLost"
                  required
                  value={itemLost}
                  onChange={(e) => setItemLost(e.target.value)}
                  placeholder="e.g. Blue Backpack, iPhone 13"
                  className="w-full p-2.5 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                />
              </div>
            </div>

            {/* Row 2: Category & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-[80]">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="category"
                  className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide"
                >
                  Category{" "}
                  <span className="text-red-600" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none w-full p-2.5 sm:p-3.5 pr-10 sm:pr-12 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent text-slate-800 font-medium transition-all shadow-sm cursor-pointer min-h-[40px] sm:min-h-[46px]"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="PersonalItems">Personal Items</option>
                    <option value="Documents">Documents</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Bags">Bags</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Others">Others</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 h-5 text-slate-500 pointer-events-none"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 relative z-[85]">
                <label
                  htmlFor="dateLost"
                  className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide"
                >
                  {reportType === "Missing Item" ? "Date Lost" : "Date Found"}{" "}
                  <span className="text-red-600" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="relative w-full flex flex-col">
                  <DatePicker
                    id="dateLost"
                    ref={datePickerRef}
                    selected={dateLost}
                    onChange={(date) => setDateLost(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select date..."
                    wrapperClassName="w-full"
                    className="
                      w-full
                      p-2.5 sm:p-3.5
                      pr-20 sm:pr-24
                      rounded-xl
                      border border-slate-200
                      bg-slate-50/70
                      text-slate-800 font-medium
                      text-xs sm:text-base
                      outline-none
                      focus:bg-white
                      focus:border-transparent
                      focus:ring-2
                      focus:ring-amber-700
                      transition-all
                      shadow-sm
                      cursor-pointer
                      min-h-[40px] sm:min-h-[46px]
                    "
                  >
                    <div className="font-sans flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-t border-slate-100 bg-slate-50/80 rounded-b-lg mt-1 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDateLost(null);
                          datePickerRef.current?.setOpen(false);
                        }}
                        className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md cursor-pointer min-h-[32px] sm:min-h-[36px]"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDateLost(new Date());
                          datePickerRef.current?.setOpen(false);
                        }}
                        className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#AD3218] hover:text-[#8a2612] hover:bg-orange-50 transition-colors px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md cursor-pointer min-h-[32px] sm:min-h-[36px]"
                      >
                        Today
                      </button>
                    </div>
                  </DatePicker>

                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-10">
                    {dateLost && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateLost(null);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer flex items-center justify-center min-w-[30px] min-h-[30px] sm:min-w-[34px] sm:min-h-[34px]"
                        title="Clear date"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        datePickerRef.current?.setOpen(true);
                      }}
                      className="p-1 text-slate-500 hover:text-[#AD3218] hover:bg-orange-50 rounded-lg transition-all cursor-pointer flex items-center justify-center min-w-[30px] min-h-[30px] sm:min-w-[34px] sm:min-h-[34px]"
                      title="Open calendar"
                    >
                      <Calendar size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Brand & Map Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-[70]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="brand"
                    className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base block uppercase tracking-wide"
                  >
                    Brand Name
                  </label>
                  <span className="text-slate-400 text-[11px] sm:text-sm font-medium">(Optional)</span>
                </div>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Nike, Apple"
                  className="w-full p-2.5 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                />
              </div>

              <div className="flex flex-col gap-1 relative">
                <label
                  htmlFor="location"
                  className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide"
                >
                  Location{" "}
                  <span className="text-red-600" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Type or pin map..."
                    className="w-full p-2.5 sm:p-3.5 pr-12 sm:pr-14 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    title="Pin location on map"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px]"
                  >
                    <MapPin size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4: Photo Evidence & ColorPicker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-start relative z-[60]">
              <div className="flex flex-col gap-1 w-full">
                <div className="pl-0.5">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="photoEvidence"
                      className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base block uppercase tracking-wide"
                    >
                      Photo Evidence
                    </label>
                    <span className="text-slate-400 text-[11px] sm:text-sm font-medium">(Optional)</span>
                  </div>
                  <span className="text-[12px] sm:text-[11px] text-gray-400 font-medium block mt-0.5 mb-1">
                    Formats: JPG, PNG • Max: 5 MB
                  </span>
                </div>
                <input
                  type="file"
                  id="photoEvidence"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer w-full min-h-[34px] sm:min-h-[38px] file:items-center file:min-h-[34px] p-1 py-1 border border-slate-200 rounded-xl bg-slate-50 file:mr-2 file:py-1 file:px-2.5 file:cursor-pointer file:rounded-xl file:border-0 file:text-[10px] sm:file:text-xs file:font-bold file:bg-[#331e0c]/10 file:text-[#331e0c] uppercase text-[11px] sm:text-sm text-slate-500 font-medium file:transition-all hover:file:bg-[#331e0c]/15 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div className="flex flex-col gap-1 w-full relative z-[95]">
                <div className="pl-0.5">
                  <span className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base block uppercase tracking-wide">
                    Item Color{" "}
                    <span className="text-red-600" aria-hidden="true">
                      *
                    </span>
                  </span>
                </div>
                <div className="w-full relative z-[999]">
                  <ColorPicker
                    value={color}
                    onChange={handleColorChange}
                    label=""
                  />
                </div>
              </div>
            </div>

            {/* Additional Info Box Area */}
            <div className="flex flex-col gap-1 relative z-[50]">
              <label
                htmlFor="additionalInfo"
                className="font-bold text-slate-700 text-xs sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide"
              >
                Additional Description Details
              </label>
              <textarea
                id="additionalInfo"
                rows={2}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Specific markings, features, or unique items inside..."
                className="w-full p-2.5 sm:p-3.5 rounded-xl text-xs sm:text-base border border-slate-200 outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent resize-none transition-all shadow-sm font-medium"
              />
            </div>

            {/* Reporter Contact Info Segment */}
            <div className="pt-3 sm:pt-5 border-t border-slate-100 relative z-[40]">
              <h3 className="text-sm sm:text-lg xl:text-xl font-black text-slate-800 mb-2 sm:mb-3 tracking-tight pl-0.5 uppercase">
                Reporter's Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1 sm:col-span-2 md:col-span-1">
                  <label
                    htmlFor="reporterName"
                    className="text-[10px] xl:text-xs font-bold text-slate-400 uppercase tracking-wider pl-0.5"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="reporterName"
                    disabled
                    value={reporterName}
                    className="w-full p-2.5 sm:p-3.5 bg-slate-100/80 text-slate-500 font-bold border border-slate-200 rounded-xl text-xs cursor-not-allowed shadow-inner min-h-[40px] sm:min-h-[46px]"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="mobile"
                    className="text-[10px] xl:text-xs font-bold text-slate-400 uppercase tracking-wider pl-0.5"
                  >
                    Mobile{" "}
                    <span className="text-red-600" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full p-2.5 sm:p-3.5 border border-slate-200 rounded-xl text-xs sm:text-base outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent focus:bg-white transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="text-[10px] xl:text-xs font-bold text-slate-400 uppercase tracking-wider pl-0.5"
                  >
                    Email{" "}
                    <span className="text-red-600" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@pup.edu.ph"
                    className="w-full p-2.5 sm:p-3.5 border border-slate-200 rounded-xl text-xs sm:text-base outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent focus:bg-white transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2 sm:gap-4 pt-1 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto relative z-[40]">
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer w-full sm:w-1/2 px-4 py-2.5 sm:py-3.5 text-xs sm:text-base uppercase tracking-wider font-extrabold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-full transition active:scale-95 shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-700 min-h-[38px] sm:min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer w-full sm:w-1/2 bg-[#02A63E] text-white font-black py-2.5 sm:py-3.5 px-4 rounded-full shadow-lg hover:bg-[#028c34] hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-wider text-xs sm:text-base text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 min-h-[38px] sm:min-h-[44px]"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>

      {showMap && (
        <div
          className="fixed inset-0 z-[10000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
          onClick={() => setShowMap(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="map-title"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[600px] animate-in zoom-in-95 duration-200 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3
                    id="map-title"
                    className="text-base sm:text-xl md:text-2xl font-extrabold uppercase text-slate-900 tracking-tight"
                  >
                    Pin Location
                  </h3>
                  <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5 uppercase tracking-wide">
                    Search or click on the map to mark the location.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(false)}
                aria-label="Close map picker"
                className="cursor-pointer p-1.5 hover:bg-slate-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-700 min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Map Contents */}
            <div className="flex-1 relative bg-slate-50 min-h-0">
              <MapPicker
                isOpen={showMap}
                onSelect={(selectedAddress) => {
                  setLocation(selectedAddress);
                  setShowMap(false);
                }}
                onClose={() => setShowMap(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}