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
  FaWrench,
  FaBolt,
  FaBatteryFull,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaDollarSign,
  FaCog
} from 'react-icons/fa'

const conversionSteps = [
  {
    step: 1,
    title: 'Assessment',
    description: 'We evaluate your bike to determine the best conversion kit and approach.',
    icon: FaCog
  },
  {
    step: 2,
    title: 'Kit Selection',
    description: 'Choose from our range of Bafang motors and battery options.',
    icon: FaBolt
  },
  {
    step: 3,
    title: 'Professional Installation',
    description: 'Our certified technicians install your conversion kit with precision.',
    icon: FaWrench
  },
  {
    step: 4,
    title: 'Testing & Handover',
    description: 'Comprehensive testing and training on your newly converted e-bike.',
    icon: FaCheckCircle
  }
]

const conversionOptions = [
  {
    name: 'Basic Conversion',
    price: 'From $1,299',
    features: [
      'Bafang Hub Motor',
      '36V 10Ah Battery',
      '50km Range',
      'Basic LCD Display',
      'Installation Included',
      '1-Year Warranty'
    ],
    description: 'Perfect for casual riders and daily commuting needs.'
  },
  {
    name: 'Premium Conversion',
    price: 'From $1,799',
    features: [
      'Bafang Mid-Drive Motor',
      '48V 14Ah Battery',
      '80km Range',
      'Color LCD Display',
      'Torque Sensor',
      '2-Year Warranty'
    ],
    description: 'Advanced features for enthusiasts and frequent riders.'
  },
  {
    name: 'Pro Conversion',
    price: 'From $2,499',
    features: [
      'Bafang Ultra Motor',
      '48V 17.5Ah Battery',
      '100km Range',
      'Smart Display',
      'All Accessories',
      '3-Year Warranty'
    ],
    description: 'Top-tier performance for serious cyclists and adventurers.'
  }
]

const benefits = [
  {
    icon: FaDollarSign,
    title: 'Cost Effective',
    description: 'Much cheaper than buying a new electric bike'
  },
  {
    icon: FaShieldAlt,
    title: 'Keep Your Bike',
    description: 'Transform your beloved bike into an e-bike'
  },
  {
    icon: FaClock,
    title: 'Quick Turnaround',
    description: 'Most conversions completed in 2-3 days'
  },
  {
    icon: FaBatteryFull,
    title: 'Latest Technology',
    description: 'State-of-the-art Bafang motor systems'
  }
]

export default function ConversionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Bike Conversion Services
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Transform your regular bike into a powerful electric bike with our expert 
              conversion services. Keep your favorite bike and enjoy electric assistance!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="#process">
                <Button size="lg">
                  Learn Process
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

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Convert Your Bike?
            </h2>
            <p className="text-lg text-gray-600">
              Converting your existing bike offers numerous advantages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Conversion Process
            </h2>
            <p className="text-lg text-gray-600">
              Professional, efficient, and reliable conversion service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {conversionSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <step.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {index < conversionSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-x-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion Options */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conversion Packages
            </h2>
            <p className="text-lg text-gray-600">
              Choose the perfect conversion package for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {conversionOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  index === 1 ? 'ring-2 ring-primary' : ''
                }`}
              >
                {index === 1 && (
                  <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {option.name}
                    </h3>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {option.price}
                    </div>
                    <p className="text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {option.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="w-4 h-4 text-secondary mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    fullWidth 
                    variant={index === 1 ? 'primary' : 'outline'}
                  >
                    Get Quote
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Convert Your Bike?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today for a free assessment and personalized quote
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