import { Link } from "react-router-dom"; // Added missing import
import { HashLink } from "react-router-hash-link";
import BALIKLogo from "../../../assets/BALIK.png";
import { Navigation, Phone, Mail } from "lucide-react";

function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["How It Works", "Success Stories", "FAQs"],
    },
    {
      title: "Company",
      links: ["About Us"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Use"],
    },
  ];

  return (
    <footer id="footer" className="bg-[#F2E4DC] border-t border-[#DBC9C0]">
      <div className="max-w-8xl mx-auto py-16 px-6 md:px-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <HashLink smooth to="/#home">
              <img
                src={BALIKLogo}
                alt="BALIK Logo"
                className="h-24 md:h-30 object-cover -translate-y-4 md:-translate-y-7"
              />
            </HashLink>

            <p className="text-md text-gray-700 max-w-md -translate-y-4 md:-translate-y-9 leading-relaxed">
              Reuniting people with their belongings through AI-powered smart
              matching and verified community reporting.
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="font-bold text-lg text-[#520000] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3 text-gray-700">
                {section.links.map((link, i) => {
                  const linkMap = {
                    // Adjusted these to match standard scrolling behavior
                    "How It Works": "/#how-it-works", 
                    FAQs: "/#faqs",
                    "Success Stories": "/#success-stories",
                    "About Us": "/about-us",
                    "Privacy Policy": "/privacy-policy",
                    "Terms of Use": "/terms-of-service",
                  };
                  const href = linkMap[link] || "#";
                  
                  // Use HashLink for anchors, Link for separate pages
                  const isAnchor = href.includes("#");
                  
                  return (
                    <li key={i}>
                      {isAnchor ? (
                        <HashLink
                          smooth
                          to={href}
                          className="hover:text-red-700 transition-colors duration-200"
                        >
                          {link}
                        </HashLink>
                      ) : (
                        <Link
                          to={href}
                          className="hover:text-red-700 transition-colors duration-200"
                        >
                          {link}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg text-[#520000] mb-4">Contact</h4>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Navigation size={18} className="mt-0.5 text-gray-800" />
                <span>Student Center, Room 105</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gray-800" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gray-800" />
                <a
                  href="mailto:lostandfound@university.edu"
                  className="hover:text-red-700 transition-colors"
                >
                  lostandfound@university.edu
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours Section */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg text-[#520000] mb-4">
              Operating Hours
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li>
                Mon - Fri:{" "}
                <span className="font-bold text-gray-600">8am - 5pm</span>
              </li>
              <li>
                Saturday:{" "}
                <span className="font-bold text-gray-600">10am - 4pm</span>
              </li>
              <li>
                Sunday: <span className="font-bold text-gray-600">Closed</span>
              </li>
              <li className="pt-2 mt-2 text-sm italic">Items kept for 30 days</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#DBC9C0] mt-12 pt-6 flex justify-center">
          <p className="text-gray-600 text-sm font-medium text-center">
            © 2026 BALIK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;