import { useState } from "react";
import { X, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ClaimModal({
  showClaim,
  setShowClaim,
  step,
  setStep,
  form,
  setForm,
  errors,
  setErrors,
  categories,
}) {
  const [file, setFile] = useState(null);

  if (!showClaim) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }

    setFile(selected);
  };

  const validateStep1 = () => {
    const newErrors = {
      fullName: !form.fullName,
      mobile: !form.mobile,
      lostLocation: !form.lostLocation,
      lostDate: !form.lostDate,
      description: !form.description,
      category: !form.category,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {step === 1 ? "Claiming Request Form" : "Security Questions"}
            </h2>
            {step === 2 && (
              <p className="text-xs text-slate-400">
                (Auto-generated based on item)
              </p>
            )}
            <p className="mt-1 text-sm text-slate-500">ITEM ID: 40257</p>
          </div>
          <button onClick={() => setShowClaim(false)}>
            <X className="cursor-pointer h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {step === 1 ? (
            <>
              {/* PAGE 1 — Contact Information & Item Ownership Details */}
              <div className="space-y-4">
                {/* Contact Information */}
                <p className="text-sm font-semibold text-slate-800">
                  Contact Information
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        setErrors((prev) => ({ ...prev, fullName: false }));
                      }}
                      className={`w-full rounded-lg border px-4 py-2 text-sm ${
                        errors.fullName ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.mobile}
                      onChange={(e) => {
                        setForm({ ...form, mobile: e.target.value });
                        setErrors((prev) => ({ ...prev, mobile: false }));
                      }}
                      className={`w-full rounded-lg border px-4 py-2 text-sm ${
                        errors.mobile ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Email Address{" "}
                      <span className="pl-1 text-black/40 ">(Optional)</span>
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Lost Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.lostLocation}
                      onChange={(e) => {
                        setForm({ ...form, lostLocation: e.target.value });
                        setErrors((prev) => ({
                          ...prev,
                          lostLocation: false,
                        }));
                      }}
                      className={`w-full rounded-lg border px-4 py-2 text-sm ${
                        errors.lostLocation
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Lost Date <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Calendar className="cursor-pointer pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <DatePicker
                        selected={
                          form.lostDate ? new Date(form.lostDate) : null
                        }
                        onChange={(date) => {
                          setForm({
                            ...form,
                            lostDate: date
                              ? date.toISOString().split("T")[0]
                              : "",
                          });
                          setErrors((prev) => ({
                            ...prev,
                            lostDate: false,
                          }));
                        }}
                        maxDate={new Date()}
                        placeholderText="Select date"
                        dateFormat="MMMM d, yyyy"
                        todayButton="Today"
                        showPopperArrow={false}
                        className={`cursor-pointer w-full rounded-lg border py-2 pl-10 pr-4 text-sm ${
                          errors.lostDate
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        calendarClassName="rounded-xl shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Item Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                        setErrors((prev) => ({
                          ...prev,
                          description: false,
                        }));
                      }}
                      className={`w-full rounded-lg border px-4 py-2 text-sm ${
                        errors.description
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Item Ownership Details */}
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  Item Ownership Details (Primary Verification)
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="mb-2 block text-xs font-medium text-slate-700 italic">
                      Item Category <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-wrap gap-3">
                      {categories
                        .filter((c) => c !== "All Items")
                        .map((cat) => (
                          <label
                            key={cat}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          >
                            <input
                              type="radio"
                              name="category"
                              value={cat}
                              checked={form.category === cat}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  category: e.target.value,
                                });
                                setErrors((prev) => ({
                                  ...prev,
                                  category: false,
                                }));
                              }}
                            />
                            {cat}
                          </label>
                        ))}

                      {/* Others option */}
                      <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                        <input
                          type="radio"
                          name="category"
                          value="Others"
                          checked={form.category === "Others"}
                          onChange={() => {
                            setForm({
                              ...form,
                              category: "Others",
                              otherCategory: "",
                            });
                            setErrors((prev) => ({
                              ...prev,
                              category: false,
                            }));
                          }}
                        />
                        Others:
                        <input
                          type="text"
                          placeholder="Specify..."
                          value={form.otherCategory || ""}
                          disabled={form.category !== "Others"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              otherCategory: e.target.value,
                            })
                          }
                          className="cursor-text ml-1 w-32 rounded border-b border-slate-300 px-2 py-0.5 text-xs disabled:bg-slate-100"
                        />
                      </label>
                    </div>

                    {errors.category && (
                      <p className="mt-1 text-xs text-red-500">
                        Please select a category.
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Unique Identifiers
                    </label>
                    <textarea
                      rows={2}
                      value={form.identifiers}
                      onChange={(e) => {
                        setForm({ ...form, identifiers: e.target.value });
                        setErrors((prev) => ({
                          ...prev,
                          identifiers: false,
                        }));
                      }}
                      className={`w-full rounded-lg border px-4 py-2 text-sm ${
                        errors.identifiers
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Photo{" "}
                      <span className="pl-1 text-black/40">(Optional)</span>
                    </label>

                    <div className="flex items-center gap-3 border rounded-lg border-gray-400">
                      {/* Hidden input */}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {/* Choose button */}
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
                      >
                        {file ? "Change File" : "Choose File"}
                      </label>

                      {/* File name */}
                      <span className="text-sm text-slate-500">
                        {file ? file.name : "No file chosen"}
                      </span>

                      {/* Remove button */}
                      {file && (
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Optional image preview */}
                    {file && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="h-24 rounded-lg border object-cover"
                        />
                      </div>
                    )}

                    <p className="mt-1 text-xs text-slate-400">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* PAGE 2 — Item Details */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-800">
                  Item Specific Details
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Item Type
                    </label>
                    <input
                      value={form.itemType}
                      onChange={(e) =>
                        setForm({ ...form, itemType: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Color / Material
                    </label>
                    <input
                      value={form.colorMaterial}
                      onChange={(e) =>
                        setForm({ ...form, colorMaterial: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Unique Marks / Features
                    </label>
                    <input
                      value={form.uniqueMarks}
                      onChange={(e) =>
                        setForm({ ...form, uniqueMarks: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Brand / Logo (if any)
                    </label>
                    <input
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Inside Contents (if applicable)
                    </label>
                    <input
                      value={form.insideItems}
                      onChange={(e) =>
                        setForm({ ...form, insideItems: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Distinct Item Only You Would Know
                    </label>
                    <input
                      value={form.secretItem}
                      onChange={(e) =>
                        setForm({ ...form, secretItem: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Last Seen Details
                    </label>
                    <input
                      value={form.lastSeen}
                      onChange={(e) =>
                        setForm({ ...form, lastSeen: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 z-10 flex gap-4 border-t px-6 py-4">
          <button
            onClick={() => (step === 1 ? setShowClaim(false) : setStep(1))}
            className="cursor-pointer flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step === 1) {
                if (validateStep1()) {
                  setStep(2);
                }
              } else {
                console.log("Submit", form);
              }
            }}
            className="cursor-pointer flex-1 rounded-lg bg-green-500 py-2 text-sm font-medium text-white"
          >
            {step === 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
