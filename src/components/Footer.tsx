import React from "react";
import Link from "next/link";
import { Activity, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">VitalScan</span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Next-generation AI computer vision for instant health vitals scanning. 
            Privacy-first, enterprise-grade wellness technology.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Product</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Features</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Enterprise</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Mobile App</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Security</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">About Us</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Careers</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Blog</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
            <li><Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">HIPAA Compliance</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-10">
        <p className="text-white/30 text-xs mb-4 md:mb-0">
          © 2026 VitalScan Health Inc. All rights reserved.
        </p>
        <div className="flex gap-6">
          <p className="text-white/30 text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Operational
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
