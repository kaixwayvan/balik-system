import ReportCard from "./ReportCard";

export default function ReportsList({ reports }) {
  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-bold">Recent Reports</h2>

      {reports.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No reports found.</p>
        </div>
      ) : (
        reports.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))
      )}
    </div>
  );
}