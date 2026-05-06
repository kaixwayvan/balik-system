import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { X } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';

export default function ExportReportsModal({ onClose }) {
  const [reportType, setReportType] = useState('Admin logs');
  const [format, setFormat] = useState('');
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState(new Date('2025-12-01'));
  const [endDate, setEndDate] = useState(new Date('2025-12-31'));

  const [recentExports, setRecentExports] = useState([
    { title: 'User Activity - CSV', time: 'Download 2 hrs ago' },
    { title: 'Admin Logs - PDF', time: 'Generated Yesterday' },
    { title: 'Transactions - Excel', time: 'Download 3 days ago' },
  ]);

  const handleExport = async () => {
    try {
      let query = supabase
        .from('items')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (reportType === 'Transactions') {
        query = query.eq('status', 'resolved');
      }

      if (keyword) {
        query = query.ilike('title', `%${keyword}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        alert("No data found for the selected filters.");
        return;
      }

      // Generate CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(obj => 
        Object.values(obj).map(val => 
          typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(',')
      ).join('\n');
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setRecentExports(prev => [
        { title: `${reportType} - ${format || 'CSV'}`, time: 'Download Just Now' },
        ...prev.slice(0, 2)
      ]);

      onClose();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export report: " + err.message);
    }
  }

  const handlePreview = () => {
    alert("Generating preview for " + dataCount + " items...");
    // In a real app, this would open a preview table
  };

  const [dataCount, setDataCount] = useState(0);

  const fetchCount = async () => {
    let query = supabase
      .from('items')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (reportType === 'Transactions') {
      query = query.eq('status', 'resolved');
    }

    if (keyword) {
      query = query.ilike('title', `%${keyword}%`);
    }

    const { count, error } = await query;
    if (!error) setDataCount(count || 0);
  };

  useEffect(() => {
    fetchCount();
  }, [reportType, startDate, endDate, keyword]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#EEF1F8] w-full max-w-[900px] rounded-[16px] shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="p-8 pb-4 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Export Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Generate and export system reports for auditing, analytics, and compliance</p>
        </div>

        <div className="p-8 pt-4 space-y-6">
          {/* Top Filters */}
          <div className="bg-white rounded-[12px] p-5 flex gap-4 border border-gray-200 shadow-sm items-center flex-wrap">
            <select value={reportType} onChange={e => setReportType(e.target.value)} className="border border-gray-300 rounded-[8px] px-4 py-2.5 bg-white text-sm text-gray-700 flex-1 min-w-[150px] outline-none focus:ring-2 focus:ring-[#363A68]">
              <option value="Admin logs">Admin logs</option>
              <option value="User Activity">User Activity</option>
              <option value="Transactions">Transactions</option>
            </select>

            <select value={format} onChange={e => setFormat(e.target.value)} className="border border-gray-300 rounded-[8px] px-4 py-2.5 bg-white text-sm text-gray-700 flex-1 min-w-[150px] outline-none focus:ring-2 focus:ring-[#363A68]">
              <option value="" disabled>File format</option>
              <option value="CSV">CSV</option>
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
            </select>

            <div className="relative flex-1 min-w-[200px]">
              <input type="text" placeholder="Search keyword (optional)" value={keyword} onChange={e => setKeyword(e.target.value)} className="border border-gray-300 rounded-[8px] px-4 py-2.5 w-full text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#363A68]" />
            </div>

            <button className="border border-gray-300 rounded-[8px] px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 min-w-[120px] transition-colors">
              Apply Filters
            </button>
          </div>

          {/* Date Pickers */}
          <div className="bg-white rounded-[12px] p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-around gap-8">
            <div className="flex-1 flex flex-col items-center">
              <h3 className="text-sm font-bold w-full text-left mb-6 text-gray-900 px-4">Start Date</h3>
              <style>{`
                .react-datepicker {
                  font-family: inherit !important;
                  border: none !important;
                }
                .react-datepicker__header {
                  background-color: white !important;
                  border-bottom: none !important;
                }
                .react-datepicker__current-month {
                  font-size: 14px !important;
                  font-weight: 700 !important;
                }
                .react-datepicker__day-name {
                  color: #6b7280 !important;
                  font-weight: 500 !important;
                  font-size: 13px !important;
                }
                .react-datepicker__day {
                  font-weight: 600 !important;
                  color: #374151 !important;
                  width: 2rem !important;
                  line-height: 2rem !important;
                }
                .react-datepicker__day--selected {
                  background-color: #f3f4f6 !important;
                  color: #111827 !important;
                  border-radius: 4px !important;
                }
                .react-datepicker__day:hover {
                  background-color: #f3f4f6 !important;
                  border-radius: 4px !important;
                }
                .react-datepicker__day--outside-month {
                  color: #d1d5db !important;
                }
                .react-datepicker__navigation {
                  top: 10px !important;
                }
                /* Seamless Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                inline
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <h3 className="text-sm font-bold w-full text-left mb-6 text-gray-900 px-4">End Date</h3>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                inline
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-white rounded-[12px] p-5 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Ready to Export ({dataCount} items)</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">Selected data will be generated based on your filters</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handlePreview}
                className="px-8 py-2.5 bg-[#d9d9d9] text-gray-800 text-sm font-bold rounded-[6px] hover:bg-[#c9c9c9] transition-colors">
                Preview
              </button>
              <button 
                onClick={handleExport}
                className="px-8 py-2.5 bg-[#3b3a63] text-white text-sm font-bold rounded-[6px] hover:bg-[#2c2b4a] transition-colors">
                Export Report
              </button>
            </div>
          </div>

          {/* Recent Exports */}
          <div className="bg-white rounded-[12px] p-6 px-8 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-[15px] mb-6 text-gray-900">Recent Exports</h3>
            <div className="space-y-5">
              {recentExports.map((exp, i) => (
                <div key={i} className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-600 font-medium">{exp.title}</span>
                  <button className="text-gray-500 font-medium hover:text-gray-800 hover:underline">{exp.time}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
