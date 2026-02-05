import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Eye, Users, Plus, Image, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import { supabase } from "../../../utils/supabaseClient";
import GreenBag from "../../../assets/home-assets/img-items/bag-green.png";
import Ring from "../../../assets/home-assets/img-items/ring.png";
import BlackWallet from "../../../assets/home-assets/img-items/wallet-black.png";
import Airpods from "../../../assets/home-assets/img-items/airpods.png";
import VerifiedIcon from "@mui/icons-material/Verified";

// Reports and stats will be loaded dynamically from Supabase

export default function FoundItems() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [selectedItemForPhoto, setSelectedItemForPhoto] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const fetchReports = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'found')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReports(data);
    } catch (err) {
      console.error("Error fetching found reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const stats = [
    {
      title: "Total Items",
      value: reports.length,
      subtitle: "Items you reported",
      bg: "bg-blue-600",
    },
    {
      title: "Claimed",
      value: reports.filter(r => r.status === 'claimed' || r.status === 'resolved').length,
      subtitle: "Successfully returned",
      bg: "bg-green-600",
    },
    {
      title: "Active",
      value: reports.filter(r => r.status === 'pending' || r.status === 'matching').length,
      subtitle: "Currently listed",
      bg: "bg-orange-500",
    },
  ];

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles((prev) => [...prev, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // Reset input so user can upload same file again if needed
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSavePhotos = () => {
    if (photoFiles.length === 0) {
      alert("Please select at least one photo to upload.");
      return;
    }
    console.log("Saving photos for item:", selectedItemForPhoto, photoFiles);
    alert("Photos uploaded successfully!");
    setPhotoFiles([]);
    setPreviewUrls([]);
    setOpenPhotoModal(false);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Found Reports</h1>
          <p className="text-sm text-gray-500">
            Items you've reported and their claim status
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchReports}
            className="cursor-pointer flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link to="/submitreport">
            <button className="cursor-pointer flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition shadow-sm">
              <Plus size={13} /> Report Found Item
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>Failed to load reports: {error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} text-white rounded-xl p-5 shadow transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg`}
          >
            <p className="text-sm">{stat.title}</p>
            <h2 className="text-3xl font-bold">{stat.value}</h2>
            <p className="text-xs opacity-90">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        ) : reports.length > 0 ? (
          reports.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-md"
            >
              {/* Image */}
              <div className="relative h-44 bg-gray-100">
                {(item.status === "matching" || item.status === "claimed" || item.status === "resolved") && (
                  <div
                    className={`absolute top-3 left-3 p-1 rounded-full shadow-lg leading-none flex items-center justify-center z-10
                      ${item.status === "matching"
                        ? "bg-blue-100 text-blue-600 border border-blue-300"
                        : "bg-green-100 text-green-600 border border-green-300"
                      }`}
                  >
                    <VerifiedIcon sx={{ fontSize: 16 }} />
                  </div>
                )}

                <img
                  src={item.image_url || GreenBag}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full shadow-md font-bold uppercase tracking-wider z-10
                    ${item.status === 'matching'
                      ? "bg-blue-100 text-blue-600 border border-blue-400"
                      : (item.status === 'claimed' || item.status === 'resolved')
                        ? "bg-green-100 text-green-700 border border-green-500"
                        : "bg-yellow-100 text-yellow-600 border border-yellow-600"
                    }`}
                >
                  {item.status === 'matching' ? 'Matching' : (item.status === 'claimed' || item.status === 'resolved') ? 'Claimed' : 'Pending'}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{item.description}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" /> {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" /> {new Date(item.date_reported).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} className="text-gray-400" /> 0 views
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} className="text-gray-400" /> 0 request
                  </span>
                </div>

                {/* Actions */}
                {(item.status === "claimed" || item.status === "resolved") ? (
                  <div className="bg-green-50 text-green-700 border border-green-600 justify-center font-bold text-center text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                    ✓ This item has been successfully claimed and returned to its owner!
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setOpenModal(true);
                      }}
                      className="flex-1 flex items-center justify-center cursor-pointer gap-2 bg-blue-600 text-white py-2 px-5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      <Users size={14} /> View claimers (0)
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItemForPhoto(item);
                        setPhotoFiles([]);
                        setPreviewUrls([]);
                        setOpenPhotoModal(true);
                      }}
                      className="flex-1 flex items-center justify-center cursor-pointer gap-2 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      <Image size={14} /> Edit Photos
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
            <p className="text-gray-500 font-medium text-lg">No found reports</p>
            <p className="text-gray-400 text-sm mt-1">Report a found item to help reunite it with its owner.</p>
          </div>
        )}
      </div>

      {/* Claim Verification Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg py-6 px-10 relative animate-fadeIn">
            <button
              onClick={() => setOpenModal(false)}
              className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold text-center mb-4">Claim Verification In Progress</h2>
            {selectedItem?.requests > 0 ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-4">
                  We have received multiple claims for this lost item. To ensure we return it to its rightful owner, we are currently verifying details with all individuals.
                </p>
              </>
            ) : (
              <div className="text-center text-sm text-gray-500 mb-6">
                This item currently has <span className="font-medium">no claimers</span>.
                <br />
                Please check back later.
              </div>
            )}
            <div className="flex justify-center">
              <button
                onClick={() => setOpenModal(false)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded-lg text-sm font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {openPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-lg py-6 px-10 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setOpenPhotoModal(false);
                setPhotoFiles([]);
                setPreviewUrls([]);
              }}
              className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">Edit Photos - {selectedItemForPhoto?.title}</h2>
            <p className="text-sm text-gray-500 mb-6">Upload new photos to help with item verification and claims.</p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Photos</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                <input
                  id="photo-input"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <label htmlFor="photo-input" className="cursor-pointer flex flex-col items-center gap-2">
                  <Image size={32} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Click to upload photos</span>
                </label>
              </div>
            </div>
            {previewUrls.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Selected Photos ({photoFiles.length})</p>
                <div className="grid grid-cols-2 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setOpenPhotoModal(false);
                  setPhotoFiles([]);
                  setPreviewUrls([]);
                }}
                className="cursor-pointer px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhotos}
                disabled={photoFiles.length === 0}
                className="cursor-pointer px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
              >
                Save Photos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
