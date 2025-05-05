import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { motion } from 'framer-motion';
import useGlobalContextProvider from '../hooks/ContextApi';

const iconComponents = {
  phone: FaPhoneAlt,
  email: HiOutlineMail,
  location: FaMapMarkerAlt,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
};

const defaultFooterData = {
  logo: "REACT QUIZ APP",
  contactInfo: [
    {
      icon: "phone",
      text: '+917738872745',
    },
    {
      icon: "email",
      text: 'mukeshrani.aman@gmail.com',
    },
    {
      icon: "location",
      text: 'Kolkata',
    },
  ],
  quickLinks: [
    { label: 'Twitter', href: '#' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aman-kaliraman-45264288/' },
    { label: 'Github', href: 'https://github.com/amank33' },
  ],
  socialLinks: [
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'twitter', url: '#' },
    { platform: 'youtube', url: '#' },
  ],
  newsletter: {
    title: 'Contact me',
    placeholder: 'Your email address',
    buttonText: 'Connect'
  },
  copyright: '© 2025 AMAN . All rights reserved'
};

function Footer({ 
  logo = defaultFooterData.logo, 
  contactInfo = defaultFooterData.contactInfo, 
  quickLinks = defaultFooterData.quickLinks, 
  socialLinks = defaultFooterData.socialLinks,
  newsletter = defaultFooterData.newsletter,
}) {
  const { isSidenavOpen } = useGlobalContextProvider();
  
  return (
     <motion.div animate={{ paddingLeft: isSidenavOpen ? '16rem' : '0rem' }}
     initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1.2 }}
                        exit={{ opacity: 0, scale: 1 }}
                        variants={{
                          hidden: { opacity: 0, y: 100 },
                          visible: { opacity: 1, y: 0 },
                        }}
     >

    <footer className="w-full bg-black text-white border-t">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Contact Info */}
          <div>
            <h2 className="text-xl font-bold text-[#00df9a]">{logo}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {contactInfo.map((item, index) => {
                const Icon = iconComponents[item.icon];
                return (
                  <li key={index} className="flex items-center text-gray-300">
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    target='_blank'
                    className="text-gray-300 hover:text-[#00df9a] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter and Social */}
          <div className="sm:col-span-2">
            <div className="rounded bg-[#000300] p-3 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#00df9a]">
                  {newsletter.title}
                </h3>
                <div className="flex items-center space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = iconComponents[social.platform];
                    return Icon ? (
                      <a 
                        key={index} 
                        href={social.url}
                        className="text-gray-400 hover:text-[#00df9a] transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="flex">
                <input
                  className="bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-500 flex h-8 w-full rounded-l-md border px-3 py-1 text-sm focus:outline-none focus:border-[#00df9a]"
                  placeholder={newsletter.placeholder}
                  type="email"
                />
                <button className="bg-[#00df9a] hover:bg-[#00bf82] text-black inline-flex h-8 items-center justify-center whitespace-nowrap rounded-r-md px-3 py-1 text-sm font-medium transition-colors">
                  {newsletter.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="py-2 text-center text-xs text-gray-400">
            {defaultFooterData.copyright}
          </p>
        </div>
      </div>
    </footer>
     </motion.div>
  );
}

export default Footer;