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
    <footer className="bg-[#420904] border-t border-gray-600 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.15)]" id="footer">
      <div className="max-w-8xl mx-auto py-16 px-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-6 h-full">
          {/* Brand */}
          <div className="md:col-span-2 w-80 overflow-hidden relative">
            <img src={BALIKLogo} alt="BALIK Logo" className="h-30 object-cover -translate-y-7" />

            <p className="text-md text-white max-w-md -translate-y-9 relative">
              Reuniting people with their belongings through AI-powered smart
              matching and verified community reporting.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-lg text-[#f5d140] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3 text-gray-200">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#f5d140] mt-12 pt-6">
          <p className="text-gray-100 text-sm">
            © 2026 BALIK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
