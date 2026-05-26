// simulation-mocks.js
import React from 'react';

export const CATEGORIES = [
    "Electronics",
    "Personal Items",
    "Accessories",
    "Bags",
    "Documents",
    "Others"
];

export const ALL_CATEGORIES = ["All Items", ...CATEGORIES]; //

export const STATUS_STYLES = {
    matches: {
        label: "Potential Matches Found",
        cardBg: "bg-yellow-50",
        border: "border-orange-200",
        badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
        progress: "bg-yellow-500",
    },
    searching: {
        label: "Actively Searching",
        cardBg: "bg-blue-50",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700 border-blue-300",
        progress: "bg-blue-500",
    },
    claimed: {
        label: "Successfully Claimed",
        cardBg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-100 text-green-700 border-green-300",
        progress: "bg-green-500",
    },
};

// Mock Auth Context
export const useAuth = () => ({
    user: { id: "mock-user-123", email: "user@example.com", user_metadata: { full_name: "Mock User" } }
});

// Mock Supabase Client
export const supabase = {
    from: () => ({
        select: () => ({
            eq: () => ({
                in: () => ({
                    order: async () => ({ data: [], error: null })
                })
            })
        })
    })
};

// Mock Services
export const itemService = {
    backfillUserDescriptionEmbeddings: async () => ({ updated: 1 }),
    getSmartMatches: async () => ([]),
    uploadItemImage: async () => "https://via.placeholder.com/400",
    reportItem: async (data) => ({ ...data, id: "mock-item-123", description_embedding: "mock" })
};

export const nlpService = {};
export const parseEmbedding = () => "mock-embedding";

// Mock Pickers
export const ColorPicker = ({ value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">Color Picker</label>
        <input type="color" value={value || "#000000"} onChange={onChange} className="w-full h-14 rounded-xl cursor-pointer" />
    </div>
);

export const MapPicker = ({ onSelect, onClose }) => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-4">
        <p className="text-slate-500 mb-4 font-medium text-center">Map Simulation</p>
        <button onClick={() => { onSelect("123 Mock St, City"); onClose(); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">Select Mock Location</button>
    </div>
);