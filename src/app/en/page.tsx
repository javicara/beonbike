'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  FaPhone,
  FaWhatsapp,
  FaSms,
  FaBolt,
  FaWrench,
  FaBicycle,
  FaMapMarked,
  FaLeaf,
  FaShieldAlt,
  FaUsers
} from 'react-icons/fa'

const services = [
  {
    icon: FaBolt,
    title: 'Electric Bike Sales',
    description: 'Premium electric bikes with Bafang motors for all terrains and preferences.',
    href: '/en/bikes',
    color: 'bg-primary',
  },
  {
    icon: FaWrench,
    title: 'Bike Conversions',
    description: 'Transform your regular bike into an electric powerhouse with our expert conversion services.',
    href: '/en/conversions',
    color: 'bg-secondary',
  },
  {
    icon: FaBicycle,
    title: 'Bike Rentals',
    description: 'Rent electric bikes for your adventures and daily commute in Sunshine Coast.',
    href: '/en/rentals',
    color: 'bg-accent',
  },
  {
    icon: FaMapMarked,
    title: 'Guided Tours',
    description: 'Explore Sunshine Coast\'s beautiful routes with our experienced local guides.',
    href: '/en/tours',
    color: 'bg-primary',
  },
]

const features = [
  {
    icon: FaLeaf,
    title: 'Eco-Friendly',
    description: 'Sustainable transportation solutions for a greener future.',
  },
  {
    icon: FaShieldAlt,
    title: 'Reliable',
    description: 'Quality products and services you can trust.',
  },
  {
    icon: FaUsers,
    title: 'Local Expertise',
    description: 'Deep knowledge of Sunshine Coast terrain and routes.',
  },
]

export default function EnglishHomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Your Electric Mobility Solution in{' '}
              <span className="text-primary">Sunshine Coast</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Premium electric bikes, expert conversions, convenient rentals, and guided tours
              throughout beautiful Sunshine Coast, Australia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/en/contact">
                <Button size="lg" className="shadow-lg">
                  Get Started Today
                </Button>
              </Link>

              <Link href="#services">
                <Button variant="outline" size="lg">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive electric mobility solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={service.href}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full border border-gray-100 hover:border-primary/20">
                    <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <div className="text-primary font-medium group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
                      Learn More →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Beonbikes?
            </h2>
            <p className="text-lg text-gray-600">
              We're committed to providing the best electric mobility experience in Sunshine Coast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Go Electric?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today to find the perfect electric mobility solution for you
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
    </div>
  )
}
