import { X, Info, Search, Package, RefreshCcw } from "lucide-react";

export default function RunAIMatchingModal({
  open,
  onClose,
  onStart,
  isProcessing,
<<<<<<< HEAD
  counts
=======
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Run AI Matching</h2>
          <X
            className="cursor-pointer text-gray-500"
            onClick={() => !isProcessing && onClose()}
          />
        </div>

        {!isProcessing && (
          <div className="p-6 space-y-5">

            {/* INFO BOX */}
            <div className="border border-blue-300 bg-blue-50 rounded-lg p-4 text-blue-700">
              <p className="flex items-center gap-2 font-bold mb-2">
                <Info size={15}/> How AI Matching Works
              </p>

              <ul className="list-disc ml-5 text-sm space-y-1">
                <li>Analyzes all pending lost and found items</li>
                <li>Uses NLP to compare descriptions, categories, and locations</li>
                <li>Generates confidence scores based on similarity</li>
                <li>Creates potential matches for admin review</li>
              </ul>
            </div>

            {/* COUNTERS */}
            <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Search className="text-red-500" />
                <div>
                  <p className="font-semibold">Pending Lost Items</p>
                  <p className="text-sm text-gray-500">
                    Items waiting to be matched
                  </p>
                </div>
              </div>

<<<<<<< HEAD
              <span className="text-2xl font-bold">{counts?.lost || 0}</span>
=======
              <span className="text-2xl font-bold">45</span>
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
            </div>

            <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package className="text-green-600" />
                <div>
                  <p className="font-semibold">Pending Found Items</p>
                  <p className="text-sm text-gray-500">
                    Items available for matching
                  </p>
                </div>
              </div>

<<<<<<< HEAD
              <span className="text-2xl font-bold">{counts?.found || 0}</span>
=======
              <span className="text-2xl font-bold">38</span>
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
            </div>

            {/* START BUTTON */}
            <button
              onClick={onStart}
              className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"
            >
              <RefreshCcw size={18} />
              Start AI Matching
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="p-12 flex flex-col items-center text-center space-y-6">
            {/* LOADING RING */}
            <div className="relative w-26 h-26">
              {/* Background ring */}
              <div className="absolute inset-0 rounded-full border-[10px] border-green-200"></div>

              {/* Gradient spinning ring */}
              <div
                className="absolute inset-0 rounded-full animate-spin
                bg-gradient-to-r from-green-400 via-green-200 to-white
                blur-[1px]
                [mask:radial-gradient(farthest-side,transparent_calc(100%_-_10px),black_0)]
                [-webkit-mask:radial-gradient(farthest-side,transparent_calc(100%_-_10px),black_0)]
              "
              ></div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Processing AI Matching...
              </h3>
              <p className="text-gray-500 mt-2">
                Analyzing items and generating matches
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}