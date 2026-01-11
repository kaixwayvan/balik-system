import { useEffect, useState, useRef } from "react"
import { getCurrentUser, logout } from "./auth/services/authService"
import { Link, useNavigate } from "react-router-dom"
import BALIKLogo from "../assets/BALIK.png"
import DocsIcon from "../assets/home-assets/icons/docs-icon.png"
import KeyIcon from "../assets/home-assets/icons/key-icon.png"
import MatchIcon from "../assets/home-assets/icons/match-icon.png"
import PhoneIcon from "../assets/home-assets/icons/phone-icon.png"
import ProcessIcon from "../assets/home-assets/icons/process-icon.png"
import WalletIcon from "../assets/home-assets/icons/wallet-icon.png"


function ReportOptionModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden relative animate-fade-in border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Choose Report Type</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-0 space-y-4">
          {/* Info Alert */}
          <div className="bg-white border border-blue-200 rounded p-3 flex items-start gap-3">
            <div className="text-red-500 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-gray-600">
              Please select whether you are identifying a personal item you have lost or submitting details about property you have found.
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button onClick={() => onSelect('lost')} className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
              <span className="text-lg">+</span> Report Lost Item
            </button>

            <button onClick={() => onSelect('found')} className="w-full bg-[#0044CC] hover:bg-[#0033AA] text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
              <span className="text-lg">+</span> Report Found Item
            </button>
          </div>

          <div className="pt-4 flex justify-center">
            <button onClick={onClose} className="bg-[#E54B4B] hover:bg-[#D43A3A] text-white px-8 py-2 rounded-md font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FEFCE8] dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative p-8 text-center border-none">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full border-4 border-[#22C55E] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Lost Item Report Submitted</h2>

        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Thank you for providing your information.
          <br />
          We have received your submission and our team is currently reviewing your report.
        </p>

        <button onClick={onClose} className="bg-[#0044CC] hover:bg-[#0033AA] text-white font-bold py-2 px-10 rounded shadow-lg transition-colors">
          OK
        </button>
      </div>
    </div>
  )
}

function ReportLostItemForm({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null

  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('No file chosen')
  const [formData, setFormData] = useState({
    reportType: 'Missing Item',
    category: '',
    brand: '',
    additionalInfo: '',
    whatWasLost: '',
    dateLost: '',
    color: '',
    location: '',
    reporterName: '',
    mobileNumber: '',
    email: '',
    photo: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      setFormData(prev => ({ ...prev, photo: file }))
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Submitted:', formData)
    // alert("Report submitted successfully!") 
    // onClose()
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/10 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl my-8 relative animate-fade-in border-t-8 border-red-800 border-x border-b border-gray-100 dark:border-gray-700">

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#8B0000] dark:text-red-500 mb-1">Submit a Report</h2>
              <p className="text-gray-600 dark:text-gray-300">Our Online Lost & Found can Help you Find what you are Looking For!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Report Type <span className="text-red-500">*</span></label>
                  <select name="reportType" value={formData.reportType} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none">
                    <option>Missing Item</option>
                    <option>Stolen Item</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Item Category <span className="text-red-500">*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none">
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Personal Accessories">Personal Accessories</option>
                    <option value="Clothing">Clothing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Gucci/Chanel" className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">What was Lost<span className="text-red-500">*</span> <span className="text-xs font-normal text-gray-500">(Pen, Jacket, Smartphone, Wallet, etc.)</span></label>
                  <input type="text" name="whatWasLost" value={formData.whatWasLost} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none" />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Date Lost<span className="text-red-500">*</span> <br /><span className="text-xs font-normal text-gray-500">Please add the approximate date of when the item was lost /found.</span></label>
                  <div className="relative">
                    <input type="date" name="dateLost" value={formData.dateLost} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 mb-8">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Color</label>
                <select name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none">
                  <option value="">Select Color</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none" />
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 mb-10">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Additional Information <br /><span className="text-xs font-normal text-gray-500">Please provide any additional details/description of your item.</span></label>
                <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="4" className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none"></textarea>
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Photo (Optional)</label>
                <div className="flex">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <button type="button" onClick={triggerFileSelect} className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-l border border-r-0 border-gray-300 dark:border-gray-500 whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-500">Choose File</button>
                  <div className="flex-1 border border-gray-300 dark:border-gray-500 rounded-r px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{fileName}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-6">Reporters Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none" />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none" />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-800 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t dark:border-gray-700">
              <button type="button" onClick={onClose} className="px-8 py-2.5 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 w-40">Cancel</button>
              <button type="submit" className="px-8 py-2.5 bg-[#22C55E] hover:bg-green-600 text-white rounded-md font-bold w-40">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [reportView, setReportView] = useState(null) // null, 'option', 'lost', 'found', 'success'
  const navigate = useNavigate()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  // initialize dark mode from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('balik_dark')
      const isDark = stored ? stored === '1' : false
      setDarkMode(isDark)
    } catch (e) {
      setDarkMode(false)
    }
  }, [])

  // apply/remove global dark class and persist preference
  useEffect(() => {
    try {
      if (darkMode) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      localStorage.setItem('balik_dark', darkMode ? '1' : '0')
    } catch (e) { }
  }, [darkMode])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }



  function UserMenuTrigger({ user, onLogout }) {
    const [open, setOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const ref = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
      function onDoc(e) {
        if (!ref.current) return
        if (!ref.current.contains(e.target)) setOpen(false)
      }
      document.addEventListener('click', onDoc)
      return () => document.removeEventListener('click', onDoc)
    }, [])

    const toggle = (e) => {
      e.stopPropagation()
      setOpen((s) => !s)
    }

    const handleLogoutClick = () => {
      setOpen(false)
      onLogout()
    }

    const go = (path) => {
      setOpen(false)
      navigate(path)
    }

    return (
      <div className="relative" ref={ref}>
        <button onClick={toggle} aria-label="Open user menu" className="p-2 rounded hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                {/* placeholder avatar */}
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ffffff&color=000`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-medium">{user?.name || 'Mike Wazowski'}</div>
                <div className="text-xs text-gray-500">Registered User</div>
              </div>
            </div>

            <div className="p-2">
              <button onClick={() => go('/profile')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
                <span className="text-lg">👤</span> View Profile
              </button>
              <button onClick={() => go('/notifications')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
                <span className="text-lg">🔔</span> Notification
              </button>
              <button onClick={() => go('/help')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
                <span className="text-lg">🆘</span> Help Center
              </button>
              <button onClick={() => go('/settings')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
                <span className="text-lg">⚙️</span> Settings
              </button>
            </div>

            <div className="border-t p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">🌙</span>
                <div className="text-sm">Dark Mode</div>
              </div>
              <button onClick={() => setDarkMode(d => !d)} className={`w-10 h-6 rounded-full flex items-center p-1 ${darkMode ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>

            <div className="border-t p-2">
              <button onClick={handleLogoutClick} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
                <span className="text-lg">🔓</span> Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="px-6 py-6 flex items-center gap-3">
            <img src={BALIKLogo} alt="BALIK" className="h-10" />
          </div>

          <nav className="px-4">
            <div className="text-xs uppercase text-gray-400 px-3 py-2">Overview</div>
            <ul className="space-y-1">
              <li>
                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100 text-gray-800">
                  <img src={DocsIcon} alt="Dashboard" className="w-5 h-5 opacity-90" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                  <img src={PhoneIcon} alt="Search" className="w-5 h-5 opacity-80" />
                  <span>Search Items</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                  <img src={MatchIcon} alt="Track" className="w-5 h-5 opacity-80" />
                  <span>Track Items</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                  <img src={KeyIcon} alt="Active Reports" className="w-5 h-5 opacity-80" />
                  <span>Active Reports</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                  <img src={WalletIcon} alt="Found Items" className="w-5 h-5 opacity-80" />
                  <span>Found Items</span>
                </Link>
              </li>
            </ul>

            <div className="mt-6 text-xs uppercase text-gray-400 px-3 py-2">My Activity</div>
            <ul className="space-y-1">
              <li>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                  <img src={ProcessIcon} alt="Claims" className="w-5 h-5 opacity-80" />
                  <span>My Claims</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                  <img src={DocsIcon} alt="History" className="w-5 h-5 opacity-80" />
                  <span>Activity History</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="p-4">
          <div className="text-xs uppercase text-gray-400 px-1 py-2">Achievements</div>
          <div className="space-y-3 mt-2">
            <div className="bg-yellow-50 p-3 rounded-md flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-100 rounded flex items-center justify-center">🏅</div>
              <div>
                <div className="text-sm font-medium text-gray-800">Helper Badge</div>
                <div className="text-xs text-gray-500">5 items helped return</div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded flex items-center justify-center">⭐</div>
              <div>
                <div className="text-sm font-medium text-gray-800">Active Reporter</div>
                <div className="text-xs text-gray-500">5+ reports submitted</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Top-right header above welcome banner */}
        <div className="flex justify-end pr-8 mb-3">
          <div className="relative flex items-center gap-3" ref={(el) => { /* placeholder for ref usage below */ }}>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.8L18 14V11a6 6 0 10-12 0v3l-.6.8a2.032 2.032 0 01-0.995 0.795L3 17h5" />
              </svg>
            </button>

            <div className="text-right">
              <div className="text-sm font-medium">Registered User</div>
              <div className="text-xs text-gray-500">{user?.name || 'User'}</div>
            </div>

            {/* Arrow & menu trigger */}
            <UserMenuTrigger user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>

        {/* Welcome banner + stats (to the right of sidebar) */}
        <div className="mb-6 rounded-lg overflow-hidden">
          <div className="bg-[#eef3fb] p-8 rounded-t-lg">
            <div className="flex items-start">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold text-red-800 mb-2">Welcome back{user && `, ${user.name}`}</h1>
                <p className="italic text-gray-600">Earn points each time you report or help return a lost item. Your impact helps strengthen our community of honesty, teamwork, and care.</p>
              </div>
            </div>
          </div>

          <div className="bg-transparent p-6 -mt-6">
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-lg shadow px-6 py-4 min-w-[180px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-2xl">🏆</div>
                <div>
                  <div className="text-sm text-gray-500">Items Claimed</div>
                  <div className="text-lg font-bold text-gray-800">8</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow px-6 py-4 min-w-[180px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">🔍</div>
                <div>
                  <div className="text-sm text-gray-500">Lost Items</div>
                  <div className="text-lg font-bold text-gray-800">9</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow px-6 py-4 min-w-[180px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">📦</div>
                <div>
                  <div className="text-sm text-gray-500">Found Items</div>
                  <div className="text-lg font-bold text-gray-800">9</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow px-6 py-4 min-w-[180px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">📊</div>
                <div>
                  <div className="text-sm text-gray-500">Total Reports</div>
                  <div className="text-lg font-bold text-gray-800">9</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => setReportView('option')} className="w-full bg-blue-600 text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-blue-700">+ Report Item</button>
                <button className="w-full bg-green-500 text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-green-600">🔍 Browse Found Items</button>
                <button className="w-full bg-orange-500 text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-orange-600">🔗 Track Items</button>
                <button className="w-full bg-yellow-400 text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-yellow-500">⏱ View Activity History</button>
                <button className="w-full bg-red-800 text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-red-900">✏️ Edit Profile</button>
              </div>
            </div>

            {/* Recent Activity card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <a href="#" className="text-sm text-blue-600">View All</a>
              </div>

              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">●</div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Lost item reported: iPhone 15 Pro</div>
                    <div className="text-xs text-gray-500">Yesterday, 3:45 PM</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">🔍</div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Reported found item</div>
                    <div className="text-xs text-gray-500">12 minutes ago</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">✏️</div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Edited a lost report</div>
                    <div className="text-xs text-gray-500">1 hour ago</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">✅</div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Item claiming request approved</div>
                    <div className="text-xs text-gray-500">5 hours ago</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Points card */}
            <div className="bg-[#2f2b4f] text-white rounded-lg p-6 shadow relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm opacity-90">Your Points</div>
                  <div className="text-3xl font-bold mt-2">450</div>
                  <div className="text-xs opacity-80 mt-2">Level 1: Seeker Status</div>
                </div>
                <div className="text-yellow-300 text-2xl">✪</div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-2 bg-white rounded-full" style={{ width: '35%' }} />
                </div>
                <div className="text-xs opacity-80 mt-2">Next Rank: Helper — 890 more points to go</div>
              </div>
            </div>

            {/* Achievements panel */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Achievements</h3>
              <div className="space-y-3">
                <div className="border border-green-100 rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">First Finder</div>
                    <div className="text-xs text-gray-500">Report your first found item</div>
                  </div>
                  <div className="text-sm text-green-600">Unlocked</div>
                </div>

                <div className="border border-green-100 rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Good Samaritan</div>
                    <div className="text-xs text-gray-500">Help return 5 items</div>
                  </div>
                  <div className="text-sm text-green-600">Unlocked</div>
                </div>

                <div className="border border-gray-100 rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Community Hero</div>
                    <div className="text-xs text-gray-500">Help return 20 items</div>
                  </div>
                  <div className="text-sm text-gray-400">0/20</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ReportOptionModal isOpen={reportView === 'option'} onClose={() => setReportView(null)} onSelect={(type) => setReportView(type)} />
      <ReportLostItemForm isOpen={reportView === 'lost'} onClose={() => setReportView(null)} onSuccess={() => setReportView('success')} />
      <ReportSuccessModal isOpen={reportView === 'success'} onClose={() => setReportView(null)} />
    </div>
  )
}
