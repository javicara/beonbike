'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { 
  FaPhone, 
  FaWhatsapp, 
  FaSms, 
  FaLeaf,
  FaHeart,
  FaUsers,
  FaAward,
  FaMapMarkerAlt,
  FaRecycle,
  FaShieldAlt
} from 'react-icons/fa'

const values = [
  {
    icon: FaLeaf,
    title: 'Sustainability',
    description: 'We\'re committed to promoting eco-friendly transportation solutions that reduce carbon footprint and protect our beautiful environment.'
  },
  {
    icon: FaHeart,
    title: 'Community',
    description: 'We believe in building strong relationships with our local community and supporting sustainable tourism in Sunshine Coast.'
  },
  {
    icon: FaShieldAlt,
    title: 'Quality',
    description: 'We only offer the highest quality electric bikes and services, ensuring reliability and safety for all our customers.'
  },
  {
    icon: FaUsers,
    title: 'Customer Focus',
    description: 'Your satisfaction is our priority. We provide personalized service and support to meet your unique mobility needs.'
  }
]

const stats = [
  {
    number: '500+',
    label: 'Happy Customers',
    description: 'Satisfied customers across Sunshine Coast'
  },
  {
    number: '3',
    label: 'Years Experience',
    description: 'Years of electric mobility expertise'
  },
  {
    number: '4',
    label: 'Service Areas',
    description: 'Comprehensive electric bike solutions'
  },
  {
    number: '100%',
    label: 'Local Owned',
    description: 'Proudly Sunshine Coast based'
  }
]

export default function AboutPage() {
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
              About Beonbikes
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Your trusted partner for electric mobility solutions in Sunshine Coast, 
              committed to sustainable transportation and exceptional customer service.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="prose prose-lg text-gray-600 space-y-4">
                  <p>
                    Beonbikes was born from a passion for sustainable transportation and 
                    a deep love for the Sunshine Coast. Founded in 2021, we recognized the 
                    growing need for eco-friendly mobility solutions in our beautiful region.
                  </p>
                  <p>
                    What started as a small electric bike shop has grown into a comprehensive 
                    electric mobility service provider, offering everything from premium e-bike 
                    sales to guided tours of our stunning coastline and hinterland.
                  </p>
                  <p>
                    Our team combines technical expertise with local knowledge to provide 
                    personalized solutions that help our customers explore, commute, and 
                    adventure in the most sustainable way possible.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Sunshine Coast Born
                    </h3>
                    <p className="text-gray-600">
                      Proudly local, deeply connected to our community
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-gray-600">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                To make sustainable electric mobility accessible, enjoyable, and practical 
                for everyone in Sunshine Coast, while showcasing the natural beauty of our 
                region through unforgettable experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-gray-100">
                    Get In Touch
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today to learn more about our electric mobility solutions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="tel:+61403460777">
                <Button variant="outline" size="lg" className="bg-white text-secondary border-white hover:bg-gray-100 flex items-center space-x-2">
                  <FaPhone className="w-5 h-5" />
                  <span>Call Now</span>
                </Button>
              </Link>
              
              <Link href="https://wa.me/61403460777">
                <Button variant="outline" size="lg" className="bg-white text-secondary border-white hover:bg-gray-100 flex items-center space-x-2">
                  <FaWhatsapp className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Button>
              </Link>
              
              <Link href="sms:+61403460777">
                <Button variant="outline" size="lg" className="bg-white text-secondary border-white hover:bg-gray-100 flex items-center space-x-2">
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