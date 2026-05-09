import { useState, useEffect } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { MapPin, Calendar, X } from "lucide-react";
import ColorPicker from "../../../shared/components/ColorPicker";
import MapPicker from "../../../shared/components/MapPicker";
import { nlpService } from "../../../services/nlpService";
import { itemService } from "../../../services/itemService";

const ALL_CATEGORIES = ["Electronics", "Accessories", "Bags", "Documents", "Others"];

export default function ReportLostItemModal({ onClose }) {
  const { profile } = useProfile();
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    reportType: "Lost Item",
    whatWasLost: "",
    itemCategory: "",
    dateLost: "",
    brand: "",
    color: "",
    customColor: "",
    location: "",
    additionalInfo: "",
    imageFile: null,
    reporterName: profile?.full_name || "",
    mobileNumber: profile?.mobile_number || "",
    email: profile?.email || "",
  });

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Upload image if exists
      let imageUrl = null;
      if (formData.imageFile) {
        imageUrl = await itemService.uploadItemImage(formData.imageFile);
      }

      // 2. Generate NLP Embedding for smart matching
      const textToEmbed = `${formData.whatWasLost}. ${formData.additionalInfo}`;
      const embedding = await nlpService.generateEmbedding(textToEmbed);

      // 3. Save to Supabase
      const itemToSave = {
        title: formData.whatWasLost,
        category: formData.itemCategory,
        date_reported: formData.dateLost,
        brand: formData.brand,
        color: formData.color,
        location: formData.location,
        description: formData.additionalInfo,
        image_url: imageUrl,
        reporter_name: formData.reporterName,
        reporter_mobile: formData.mobileNumber,
        reporter_email: formData.email,
        type: "lost",
        embedding: embedding
      };

      await itemService.reportItem(itemToSave);
      
      console.log("Lost Item Report Saved Successfully");
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit report. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto seamless-scrollbar rounded-[3rem] shadow-2xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-10 py-6 border-b border-slate-100 flex justify-between items-center z-20">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Report Lost Item</h2>
            <p className="text-slate-500 text-sm">Fill in the details to help others identify your item.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Primary Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Report Type <span className="text-red-500">*</span></label>
                <input type="text" value="Lost Item" readOnly className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-100 font-bold text-slate-600" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">What was Lost <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="whatWasLost" 
                  value={formData.whatWasLost} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Blue Backpack" 
                  className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Category <span className="text-red-500">*</span></label>
                <select 
                  name="itemCategory" 
                  value={formData.itemCategory} 
                  onChange={handleInputChange} 
                  className="cursor-pointer w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white" 
                  required
                >
                  <option value="">Select category</option>
                  {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Date Lost <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="dateLost" 
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.dateLost} 
                    onChange={handleInputChange} 
                    className="date-input-field cursor-pointer w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white transition-all pr-12 appearance-none" 
                    required 
                  />
                  <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg text-left">Location Lost <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location} 
                    onChange={handleInputChange}
                    placeholder="Enter location or use map pin..." 
                    className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all outline-none pr-12"
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all cursor-pointer z-10"
                    title="Pick on map"
                  >
                    <MapPin size={24} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Brand</label>
                <input 
                  type="text" 
                  name="brand" 
                  value={formData.brand} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Nike, Apple" 
                  className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <ColorPicker 
                  value={formData.color} 
                  onChange={handleInputChange} 
                  label="Item Color"
                />
                {formData.color === "Other" && (
                  <input 
                    name="customColor"
                    type="text" 
                    placeholder="Please specify color..." 
                    className="mt-2 w-full p-5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-blue-50"
                    value={formData.customColor || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Photo of Item (Optional)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-bold text-slate-700 text-lg">Additional Details</label>
              <textarea 
                name="additionalInfo" 
                value={formData.additionalInfo} 
                onChange={handleInputChange} 
                rows={4} 
                className="w-full p-5 border border-slate-200 rounded-2xl outline-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all" 
                placeholder="Any specific markings or unique features..." 
              />
            </div>

            <div className="pt-10 border-t border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-8">Reporter's Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="reporterName" value={formData.reporterName} onChange={handleInputChange} placeholder="Your Name" className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="09XX-XXX-XXXX" className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50" required />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-8 pb-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-10 py-5 rounded-full font-bold text-slate-500 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-red-600 text-white font-black py-5 px-16 rounded-full shadow-xl hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Picker Modal */}
      {showMap && (
        <MapPicker 
          onClose={() => setShowMap(false)} 
          onSelect={(loc) => {
            setFormData(prev => ({ ...prev, location: loc }));
            setShowMap(false);
          }} 
        />
      )}
    </div>
  );
}
