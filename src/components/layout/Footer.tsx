import React from 'react'
import Link from 'next/link'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Beonbike</span>
              <span className="text-2xl font-bold text-white">.pro</span>
            </Link>
            <p className="text-gray-300">
              Your premier electric mobility solution in Sunshine Coast, Australia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <Link href="/bikes" className="block text-gray-300 hover:text-primary transition-colors">
                Electric Bikes
              </Link>
              <Link href="/conversions" className="block text-gray-300 hover:text-primary transition-colors">
                Conversions
              </Link>
              <Link href="/rentals" className="block text-gray-300 hover:text-primary transition-colors">
                Rentals
              </Link>
              <Link href="/tours" className="block text-gray-300 hover:text-primary transition-colors">
                Guided Tours
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-gray-300 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="w-4 h-4 text-primary" />
                <Link href="tel:+61403460777" className="text-gray-300 hover:text-primary transition-colors">
                  +61 403 460 777
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-4 h-4 text-primary" />
                <Link href="mailto:info@beonbike.pro" className="text-gray-300 hover:text-primary transition-colors">
                  info@beonbike.pro
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Sunshine Coast, QLD</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="w-4 h-4 text-primary" />
                <Link href="https://wa.me/61403460777" className="text-gray-300 hover:text-primary transition-colors">
                  WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Beonbike.pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}