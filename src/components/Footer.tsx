import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import logo from "@/assets/logo-small.png";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="404 Sports Bar & Grill" className="h-12 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Atlanta's premier sports bar & grill. Great food, cold drinks, and the best game-day atmosphere in the city.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Menu", to: "/menu" },
                { label: "Reservation", to: "/reservation" },
                { label: "Events", to: "/events" },
                { label: "Catering", to: "/catering" },
                { label: "Careers", to: "/careers" },
                { label: "Order Now", to: "/order" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>1329 Glenwood Ave SE, Atlanta, GA 30316</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span>(404) 549-7977</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span>info@404sportsbar.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Hours</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-primary flex-shrink-0" />
                <span>Mon–Thu: 4PM – 12AM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-primary flex-shrink-0" />
                <span>Fri–Sat: 12PM – 2AM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-primary flex-shrink-0" />
                <span>Sunday: 12PM – 10PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <p>© {new Date().getFullYear()} 404 Sports Bar & Grill. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
