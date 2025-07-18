'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  FaPhone, 
  FaWhatsapp, 
  FaSms, 
  FaBicycle,
  FaClock,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaHelmet,
  FaMobileAlt,
  FaLock
} from 'react-icons/fa'

const rentalPackages = [
  {
    name: 'Hourly Rental',
    price: '$25/hour',
    duration: '1-4 hours',
    features: [
      'Perfect for short trips',
      'Helmet included',
      'Basic insurance',
      'Phone holder',
      'Lock included'
    ],
    description: 'Great for quick errands or short adventures around town.',
    popular: false
  },
  {
    name: 'Daily Rental',
    price: '$89/day',
    duration: 'Full day',
    features: [
      'Best value option',
      'All accessories included',
      'Comprehensive insurance',
      'GPS navigation',
      'Roadside assistance'
    ],
    description: 'Perfect for tourists and day-long adventures.',
    popular: true
  },
  {
    name: 'Weekly Rental',
    price: '$450/week',
    duration: '7 days',
    features: [
      'Lowest daily rate',
      'Free maintenance',
      'Premium accessories',
      'Multiple pickup locations',
      'Extended support'
    ],
    description: 'Ideal for extended stays and serious exploration.',
    popular: false
  }
]

const includedAccessories = [
  {
    icon: FaHelmet,
    name: 'Safety Helmet',
    description: 'Certified safety helmet in various sizes'
  },
  {
    icon: FaLock,
    name: 'Security Lock',
    description: 'Heavy-duty lock for secure parking'
  },
  {
    icon: FaMobileAlt,
    name: 'Phone Holder',
    description: 'Secure phone mount for navigation'
  },
  {
    icon: FaMapMarkerAlt,
    name: 'GPS Navigation',
    description: 'Pre-loaded with local routes and attractions'
  }
]

const pickupLocations = [
  {
    name: 'Main Office',
    address: '123 Ocean Drive, Maroochydore',
    hours: '8:00 AM - 6:00 PM',
    contact: '+61 403 460 777'
  },
  {
    name: 'Noosa Junction',
    address: '456 Sunshine Beach Rd, Noosa',
    hours: '9:00 AM - 5:00 PM',
    contact: '+61 403 460 777'
  },
  {
    name: 'Caloundra Hub',
    address: '789 Bulcock St, Caloundra',
    hours: '8:30 AM - 5:30 PM',
    contact: '+61 403 460 777'
  }
]

export default function RentalsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-accent/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Electric Bike Rentals
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Explore Sunshine Coast the eco-friendly way! Rent our premium electric bikes 
              for your adventures, whether it's a quick trip or an extended stay.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="#packages">
                <Button size="lg">
                  View Packages
                </Button>
              </Link>
              
              <Link href="#contact">
                <Button variant="outline" size="lg">
                  Book Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rental Packages */}
      <section id="packages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rental Packages
            </h2>
            <p className="text-lg text-gray-600">
              Flexible options to suit your schedule and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {rentalPackages.map((package_, index) => (
              <motion.div
                key={package_.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  package_.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {package_.popular && (
                  <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {package_.name}
                    </h3>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {package_.price}
                    </div>
                    <div className="text-gray-500 mb-3">
                      {package_.duration}
                    </div>
                    <p className="text-gray-600">
                      {package_.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {package_.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="w-4 h-4 text-secondary mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    fullWidth 
                    variant={package_.popular ? 'primary' : 'outline'}
                  >
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Included Accessories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Included
            </h2>
            <p className="text-lg text-gray-600">
              All rentals come with essential accessories for a safe and enjoyable ride
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {includedAccessories.map((accessory, index) => (
              <motion.div
                key={accessory.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <accessory.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {accessory.name}
                </h3>
                <p className="text-gray-600">
                  {accessory.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pickup Locations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pickup Locations
            </h2>
            <p className="text-lg text-gray-600">
              Convenient locations across Sunshine Coast for easy pickup and drop-off
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pickupLocations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className="text-center mb-4">
                  <FaMapMarkerAlt className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {location.name}
                  </h3>
                </div>
                
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start space-x-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{location.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{location.contact}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Book your electric bike rental today and explore Sunshine Coast like never before
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="tel:+61403460777">
                <Button variant="outline" size="lg" className="bg-white text-accent border-white hover:bg-gray-100 flex items-center space-x-2">
                  <FaPhone className="w-5 h-5" />
                  <span>Call Now</span>
                </Button>
              </Link>
              
              <Link href="https://wa.me/61403460777">
                <Button variant="outline" size="lg" className="bg-white text-accent border-white hover:bg-gray-100 flex items-center space-x-2">
                  <FaWhatsapp className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Button>
              </Link>
              
              <Link href="sms:+61403460777">
                <Button variant="outline" size="lg" className="bg-white text-accent border-white hover:bg-gray-100 flex items-center space-x-2">
                  <FaSms className="w-5 h-5" />
                  <span>SMS</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}