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
  FaBolt, 
  FaBatteryFull, 
  FaShieldAlt, 
  FaWrench,
  FaMapMarkerAlt,
  FaCheckCircle
} from 'react-icons/fa'

const bikeModels = [
  {
    name: 'Urban Commuter',
    price: 'From $2,499',
    image: '/images/bike-urban.jpg',
    features: [
      'Bafang Mid-Drive Motor',
      '48V 14Ah Samsung Battery',
      '80km Range',
      'Shimano 8-Speed',
      'Hydraulic Disc Brakes',
      'LED Lights & Display'
    ],
    description: 'Perfect for daily commuting and city rides with comfort and efficiency.'
  },
  {
    name: 'Mountain Explorer',
    price: 'From $3,299',
    image: '/images/bike-mountain.jpg',
    features: [
      'Bafang Ultra Motor',
      '48V 17.5Ah Battery',
      '100km Range',
      'Full Suspension',
      'All-Terrain Tires',
      'Waterproof Design'
    ],
    description: 'Built for adventure and challenging terrain with maximum power.'
  },
  {
    name: 'Cargo Hauler',
    price: 'From $3,799',
    image: '/images/bike-cargo.jpg',
    features: [
      'Bafang Mid-Drive Motor',
      '48V 20Ah Battery',
      '90km Range',
      'Heavy-Duty Frame',
      '80kg Load Capacity',
      'Integrated Cargo Box'
    ],
    description: 'Ideal for families and businesses needing extra carrying capacity.'
  }
]

const bafangFeatures = [
  {
    icon: FaBolt,
    title: 'Powerful Performance',
    description: 'Up to 1000W of power for any terrain'
  },
  {
    icon: FaBatteryFull,
    title: 'Long Range',
    description: 'Up to 100km on a single charge'
  },
  {
    icon: FaShieldAlt,
    title: 'Reliable Quality',
    description: '2-year warranty on all components'
  },
  {
    icon: FaWrench,
    title: 'Easy Maintenance',
    description: 'Local service and support available'
  }
]

export default function BikesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Premium Electric Bikes
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Discover our range of high-quality electric bikes featuring Bafang motors, 
              designed for every riding style and terrain in Sunshine Coast.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="#models">
                <Button size="lg">
                  View Our Bikes
                </Button>
              </Link>
              
              <Link href="#contact">
                <Button variant="outline" size="lg">
                  Get Quote
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bike Models Section */}
      <section id="models" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Electric Bike Models
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our carefully selected range of electric bikes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {bikeModels.map((bike, index) => (
              <motion.div
                key={bike.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-64 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                  <div className="text-6xl text-primary/30">
                    <FaBolt />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {bike.name}
                    </h3>
                    <span className="text-primary font-bold text-lg">
                      {bike.price}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {bike.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {bike.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="w-4 h-4 text-secondary mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button fullWidth>
                    Learn More
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bafang Motors Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by Bafang Motors
            </h2>
            <p className="text-lg text-gray-600">
              Industry-leading motor technology for superior performance and reliability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bafangFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Electric Bike?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today for personalized recommendations and test rides
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="tel:+61403460777">
                <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-gray-100 flex items-center space-x-2">
                  <FaPhone className="w-5 h-5" />
                  <span>Call Now</span>
                </Button>
              </Link>
              
              <Link href="https://wa.me/61403460777">
                <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-gray-100 flex items-center space-x-2">
                  <FaWhatsapp className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Button>
              </Link>
              
              <Link href="sms:+61403460777">
                <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-gray-100 flex items-center space-x-2">
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