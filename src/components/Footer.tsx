import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    "Movies Now Showing": [
      "Pushpa 2",
      "Mufasa",
      "Baby John",
      "Marco",
      "Viduthalai Part 2",
    ],
    "Upcoming Movies": [
      "Azaad",
      "Sky Force",
      "Emergency",
      "Raid 2",
      "Deva",
    ],
    "Help": [
      "About Us",
      "Contact Us",
      "Terms & Conditions",
      "Privacy Policy",
      "FAQs",
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-12">
        {/* Logo & Description */}
        <div className="mb-10">
          <div className="text-2xl font-bold mb-3">
            <span className="text-primary">book</span>
            <span className="text-foreground">my</span>
            <span className="text-primary">show</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            Your one-stop destination for booking movie tickets, events, plays, sports, and more. Experience entertainment like never before.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-foreground font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Follow Us</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="p-2 rounded-full bg-secondary hover:bg-primary text-muted-foreground hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 BookMyShow Clone. Made for demonstration purposes.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                Terms of Use
              </a>
              <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
