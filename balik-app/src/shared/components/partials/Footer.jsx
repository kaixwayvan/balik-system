import {
  Share2,
  MessageSquare,
  Camera,
  Printer
} from "lucide-react";
import BALIKLogo from "../../../assets/BALIK.png";

function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["How It Works", "Success Stories", "FAQs"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Contact"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
    },
    {
      title: "Support",
      links: [
        "Help Center",
        "Safety Tips",
        "Community Guidelines",
        "Report Abuse"
      ]
    }
  ]

  return (
    <footer className="bg-white">
      <div className="max-w-8xl mx-auto py-16 px-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-6">
          
          {/* Brand */}
          <div className="md:col-span-2 w-80">
            <img
              src={BALIKLogo}
              alt="BALIK Logo"
              className="h-30 mb-0"
            />

            <p className="text-md text-gray-600 max-w-md">
              Reuniting people with their belongings through AI-powered
              smart matching and verified community reporting.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              {[Share2, MessageSquare, Camera, Printer].map(
                (Icon, index) => (
                  <button
                    key={index}
                    className="p-3 transition"
                  >
                    <Icon className="w-5 h-5 text-[#ba0802] hover:text-orange-700" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-lg text-red mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3 text-gray-600">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-black transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-6">
          <p className="text-gray-500 text-sm">
            © 2026 BALIK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
