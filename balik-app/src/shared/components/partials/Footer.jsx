import { Link } from "react-router-dom";
import BALIKLogo from "../../../assets/BALIK.png";

function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["How It Works", "Success Stories", "FAQs"],
    },
    {
      title: "Company",
      links: ["About Us", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
    {
      title: "Support",
      links: [
        "Help Center",
        "Safety Tips",
        "Community Guidelines",
        "Report Abuse",
      ],
    },
  ];

  return (
    <footer id="footer" className="bg-[#F2E4DC] border-t border-[#DBC9C0]">
      <div className="max-w-8xl mx-auto py-16 px-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-6 h-full">
          {/* Brand */}
          <div className="md:col-span-2 w-80 overflow-hidden relative">
            <img 
              src={BALIKLogo} 
              alt="BALIK Logo" 
              className="h-30 object-cover -translate-y-7" 
            />

            <p className="text-md text-gray-700 max-w-md -translate-y-9 relative leading-relaxed">
              Reuniting people with their belongings through AI-powered smart
              matching and verified community reporting.
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-lg text-[#520000] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3 text-gray-700">
                {section.links.map((link, i) => {
                  const linkMap = {
                    "How It Works": "/#how-it-works",
                    "FAQs": "/#faq",
                    "Success Stories": "/#success-stories",
                    "About Us": "/about-us",
                    "Contact": "/contact",
                    "Privacy Policy": "/privacy-policy",
                    "Terms of Service": "/terms-of-service",
                    "Cookie Policy": "/cookie-policy",
                    "Help Center": "/help-center",
                    "Safety Tips": "/safety-tips",
                    "Community Guidelines": "/community-guidelines",
                    "Report Abuse": "/report-abuse",
                  };
                  const href = linkMap[link] || "#";
                  return (
                    <li key={i}>
                      <Link to={href} className="hover:text-red-700 transition-colors duration-200">
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#DBC9C0] mt-12 pt-6">
          <p className="text-gray-600 text-sm font-medium">
            © 2026 BALIK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
