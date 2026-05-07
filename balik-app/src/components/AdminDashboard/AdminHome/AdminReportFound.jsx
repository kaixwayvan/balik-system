import { useState, useEffect } from "react";
import { MapPinned, X, Plus } from "lucide-react";
import ColorPicker from "../../../shared/components/ColorPicker";
import MapPicker from "../../../shared/components/MapPicker";
import { useAuth } from "../../../shared/context/AuthContext";
import { itemService } from "../../../services/itemService";
import { CATEGORIES } from "../../../shared/constants/categories";

const initialFoundFormData = {
  reportType: "Found Item",
  whatWasFound: "",
  itemCategory: "",
  dateFound: "",
  brand: "",
  color: "",
  location: "",
  additionalInfo: "",
  photo: null,
  reporterName: "",
  mobileNumber: "",
  email: "",
  anonymous: false,
};

export default function AdminReportFound({ isOpen, onClose }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFoundFormData);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        reporterName: user.user_metadata?.full_name || "",
        email: user.email || "",
        mobileNumber: user.user_metadata?.mobile_number || "",
      }));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleLocationSelect = (address) => {
    setFormData(prev => ({ ...prev, location: address }));
    setShowMapModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (formData.photo) {
        imageUrl = await itemService.uploadItemImage(formData.photo);
      }

      const mappedData = {
        user_id: user.id,
        type: 'found',
        category: formData.itemCategory,
        title: formData.whatWasFound,
        description: `Brand: ${formData.brand}\nColor: ${formData.color}\n\n${formData.additionalInfo}`,
        location: formData.location,
        date_reported: new Date().toISOString(),
        date_found: new Date(formData.dateFound).toISOString(),
        status: 'pending',
        image_url: imageUrl,
        metadata: {
          brand: formData.brand,
          color: formData.color,
          reporter: {
            name: formData.reporterName,
            mobile: formData.mobileNumber,
            email: formData.email
          }
        }
      };

      await itemService.reportItem(mappedData);
      alert("Found item report encoded successfully!");
      onClose();
      setFormData(initialFoundFormData);
      setPhotoPreview(null);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit report: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl max-w-4xl w-full p-8 relative mx-4 shadow-xl my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#7B1C1C] mb-1">Submit a Report</h2>
        <p className="text-gray-600 mb-6">Our Online Lost & Found can Help you Find what you are Looking For!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Report Type <span className="text-red-500">*</span></label>
              <p className="text-xs text-transparent mb-1 select-none">&nbsp;</p>
              <select name="reportType" value={formData.reportType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                <option value="Found Item">Found Item</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">What was Found <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-1">(Pen, Jacket, Smartphone, Wallet, etc.)</p>
              <input type="text" name="whatWasFound" value={formData.whatWasFound} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Item Category <span className="text-red-500">*</span></label>
              <p className="text-xs text-transparent mb-1 select-none">&nbsp;</p>
              <select name="itemCategory" value={formData.itemCategory} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Date Found <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-1">Approximate date of when the item was found.</p>
              <input type="date" name="dateFound" value={formData.dateFound} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Brand</label>
              <p className="text-xs text-transparent mb-1 select-none">&nbsp;</p>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Aquaflask / Lenovo" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
            <ColorPicker 
              value={formData.color} 
              onChange={handleChange} 
            />
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Location <span className="text-red-500">*</span></label>
              <p className="text-xs text-transparent mb-1 select-none">&nbsp;</p>
              <div className="relative group">
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required
                  className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 transition-all" 
                  placeholder="Enter location or use map"
                />
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                  title="Select from Map"
                >
                  <MapPinned size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Additional Information</label>
              <p className="text-xs text-gray-500 mb-1">Please provide any additional details/description of the item.</p>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Photo (Optional)</label>
              <p className="text-xs text-gray-500 mb-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
              <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handlePhotoChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />}
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#7B1C1C] mb-4">Reporters Information</h3>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Name <span className="text-red-500">*</span></label>
              <p className="text-xs text-transparent mb-1 select-none">&nbsp;</p>
              <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Mobile Number <span className="text-red-500">*</span></label>
              <p className="text-xs text-transparent mb-1 select-none">&nbsp;</p>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7B1C1C]">Email <span className="text-red-500">*</span></label>
              <p className="text-xs text-transparent mb-1 select-none">&nbsp;</p>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-12 py-3 border border-gray-400 rounded-lg font-semibold hover:bg-gray-100 transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`px-12 py-3 bg-[#00C853] hover:bg-[#00ad48] text-white font-semibold rounded-lg transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-3xl w-full h-[650px] overflow-hidden relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select Location</h1>
                <p className="text-sm text-slate-500 font-medium text-left">Pinpoint exactly where it happened</p>
              </div>
              <button 
                onClick={() => setShowMapModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-8 pt-4">
              <MapPicker 
                onSelect={handleLocationSelect} 
                onClose={() => setShowMapModal(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
