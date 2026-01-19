import {
  LayoutDashboard,
  Search,
  MapPin,
  FileText,
  CheckCircle,
  Bell,
  User,
  Edit,
  Trash2,
  Star,
  Award,
} from "lucide-react";

export default function TrackItems() {
  return (
    <div className="flex min-h-screen bg-[#EEF1F8]">
      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* CONTENT */}
        <section className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Item Tracking Overview
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Track all your reported lost and found items in one place
          </p>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard color="bg-purple-500" title="Total Items" value="6" />
            <StatCard color="bg-red-500" title="Lost Items" value="3" />
            <StatCard color="bg-green-700" title="Found Items" value="3" />
            <StatCard color="bg-green-500" title="Resolved" value="2" />
          </div>

          {/* TIMELINE */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Recent Activity Timeline</h3>

            <div className="space-y-5">
              <TimelineItem
                id="ITEM - 10137"
                category="Electronics - Camera"
                location="PUP-Main Library"
                status="Report Submitted"
                statusColor="bg-gray-200"
              />

              <TimelineItem
                id="ITEM - 20146"
                category="Personal Belongings - ID"
                location="PUP-ITech Lab 105"
                status="Under Review"
                statusColor="bg-red-500 text-white"
              />

              <TimelineItem
                id="ITEM - 30146"
                category="Personal Belongings - Green card holder"
                location="PUP-Lagoon"
                status="Report Submission Approved"
                statusColor="bg-green-500 text-white"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* COMPONENTS */

function StatCard({ color, title, value }) {
  return (
    <div className={`${color} rounded-xl p-4 text-white shadow`}>
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold text-right">{value}</p>
    </div>
  );
}

function TimelineItem({ id, category, location, status, statusColor }) {
  return (
    <div className="flex items-center gap-4 border rounded-xl p-4 shadow-sm">
      <div className="w-20 h-20 bg-gray-200 rounded-lg" />

      <div className="flex-1">
        <h4 className="font-bold">{id}</h4>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-xs text-gray-400">{location}</p>
      </div>

      <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>

      <div className="flex gap-2">
        <button className="bg-blue-600 text-white p-2 rounded-lg">
          <Edit size={16} />
        </button>
        <button className="bg-red-600 text-white p-2 rounded-lg">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
