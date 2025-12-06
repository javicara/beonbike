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
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaQuestionCircle,
  FaUserTie,
  FaBolt,
  FaWrench,
  FaBicycle,
  FaMapMarked
} from 'react-icons/fa'

const contactMethods = [
  {
    icon: FaPhone,
    title: 'Phone',
    description: 'Call us for immediate assistance',
    value: '+61 403 460 777',
    link: 'tel:+61403460777',
    color: 'text-primary'
  },
  {
    icon: FaWhatsapp,
    title: 'WhatsApp',
    description: 'Message us for quick responses',
    value: '+61 403 460 777',
    link: 'https://wa.me/61403460777',
    color: 'text-secondary'
  },
  {
    icon: FaSms,
    title: 'SMS',
    description: 'Send us a text message',
    value: '+61 403 460 777',
    link: 'sms:+61403460777',
    color: 'text-accent'
  },
  {
    icon: FaEnvelope,
    title: 'Email',
    description: 'Email us for detailed inquiries',
    value: 'info@beonbikes.com',
    link: 'mailto:info@beonbikes.com',
    color: 'text-primary'
  }
]

const businessHours = [
  { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
  { day: 'Public Holidays', hours: 'By Appointment' }
]

const serviceInquiries = [
  {
    icon: FaBolt,
    title: 'Electric Bike Sales',
    description: 'Inquire about our premium electric bike models',
    link: '/bikes'
  },
  {
    icon: FaWrench,
    title: 'Bike Conversions',
    description: 'Transform your bike into an electric powerhouse',
    link: '/conversions'
  },
  {
    icon: FaBicycle,
    title: 'Rentals',
    description: 'Rent electric bikes for your adventures',
    link: '/rentals'
  },
  {
    icon: FaMapMarked,
    title: 'Guided Tours',
    description: 'Explore Sunshine Coast with expert guides',
    link: '/tours'
  }
]

export default function ContactPage() {
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
              Contact Us
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Get in touch with our team for personalized electric mobility solutions. 
              We're here to help you find the perfect e-bike experience.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600">
              Choose your preferred way to contact us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={method.link}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-primary/20">
                    <div className={`w-16 h-16 ${method.color.replace('text-', 'bg-')}/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className={`w-8 h-8 ${method.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {method.description}
                    </p>
                    <div className={`${method.color} font-medium text-lg`}>
                      {method.value}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours & Location */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <FaClock className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
                </div>
                
                <div className="space-y-4">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{schedule.day}</span>
                      <span className="text-primary font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> We're also available for emergency repairs and 
                    urgent rentals outside business hours. Contact us for special arrangements.
                  </p>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <FaMapMarkerAlt className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Our Location</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Main Office & Workshop</h3>
                    <p className="text-gray-600">
                      123 Ocean Drive<br />
                      Maroochydore, QLD 4558<br />
                      Sunshine Coast, Australia
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Service Areas</h3>
                    <p className="text-gray-600">
                      We provide services throughout the Sunshine Coast region including:
                    </p>
                    <ul className="text-gray-600 mt-2 space-y-1">
                      <li>• Maroochydore & Mooloolaba</li>
                      <li>• Noosa & Tewantin</li>
                      <li>• Caloundra & Kawana</li>
                      <li>• Maleny & Hinterland</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Inquiries */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Service Inquiries
            </h2>
            <p className="text-lg text-gray-600">
              Get specific information about our different services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceInquiries.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={service.link}>
                  <div className="bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 p-6 text-center hover:bg-white">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <FaQuestionCircle className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer test rides?
              </h3>
              <p className="text-gray-600">
                Yes! We encourage test rides for all our bikes. Contact us to schedule 
                a test ride at your convenience.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <FaQuestionCircle className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's included in bike conversions?
              </h3>
              <p className="text-gray-600">
                Our conversions include motor, battery, display, installation, 
                testing, and comprehensive training on your new e-bike.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <FaQuestionCircle className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you provide delivery?
              </h3>
              <p className="text-gray-600">
                Yes, we offer delivery throughout the Sunshine Coast region. 
                Contact us for delivery options and pricing.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <FaQuestionCircle className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's your warranty policy?
              </h3>
              <p className="text-gray-600">
                We offer comprehensive warranties on all our products and services. 
                Warranty terms vary by service - contact us for specific details.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today for personalized electric mobility solutions
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