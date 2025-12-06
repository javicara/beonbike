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
  FaMapMarkedAlt,
  FaClock,
  FaUsers,
  FaCamera,
  FaLeaf,
  FaCheckCircle,
  FaStar,
  FaRoute,
  FaShieldAlt
} from 'react-icons/fa'

const tourPackages = [
  {
    name: 'Coastal Explorer',
    duration: '3 hours',
    difficulty: 'Easy',
    groupSize: 'Up to 8 people',
    price: '$79/person',
    features: [
      'Scenic coastal pathways',
      'Beach stops for photos',
      'Complimentary refreshments',
      'Professional local guide',
      'All safety equipment',
      'Small group experience'
    ],
    description: 'Perfect for families and beginners. Explore beautiful coastal trails with stunning ocean views.',
    highlights: ['Glass House Mountains views', 'Mooloolaba Beach', 'Local wildlife spotting']
  },
  {
    name: 'Hinterland Adventure',
    duration: '4 hours',
    difficulty: 'Moderate',
    groupSize: 'Up to 6 people',
    price: '$125/person',
    features: [
      'Mountain trails exploration',
      'Rainforest pathways',
      'Local cafe lunch included',
      'Photography opportunities',
      'Expert nature guide',
      'Premium e-bikes provided'
    ],
    description: 'Experience the lush hinterland with guided tours through rainforest and mountain trails.',
    highlights: ['Mapleton Falls', 'Maleny township', 'Kondalilla Falls']
  },
  {
    name: 'Sunset Premium',
    duration: '2.5 hours',
    difficulty: 'Easy',
    groupSize: 'Up to 4 people',
    price: '$149/person',
    features: [
      'Golden hour photography',
      'Exclusive sunset locations',
      'Gourmet picnic included',
      'Champagne toast',
      'Private guide service',
      'Luxury e-bike experience'
    ],
    description: 'Intimate sunset tour with premium service and exclusive locations for unforgettable memories.',
    highlights: ['Point Cartwright', 'Mooloolah River', 'Private beach access']
  }
]

const tourFeatures = [
  {
    icon: FaUsers,
    title: 'Expert Local Guides',
    description: 'Knowledgeable guides with deep local expertise and passion for the region'
  },
  {
    icon: FaShieldAlt,
    title: 'Safety First',
    description: 'Comprehensive safety briefing and all necessary protective equipment provided'
  },
  {
    icon: FaCamera,
    title: 'Photo Opportunities',
    description: 'Carefully selected stops at the most Instagram-worthy locations'
  },
  {
    icon: FaLeaf,
    title: 'Eco-Friendly',
    description: 'Sustainable tourism supporting local conservation efforts'
  }
]

const popularRoutes = [
  {
    name: 'Noosa to Tewantin',
    distance: '15km',
    difficulty: 'Easy',
    description: 'Scenic river route perfect for beginners'
  },
  {
    name: 'Caloundra Coastal',
    distance: '12km',
    difficulty: 'Easy',
    description: 'Beautiful coastal pathway with beach access'
  },
  {
    name: 'Maleny Hinterland',
    distance: '18km',
    difficulty: 'Moderate',
    description: 'Mountain trails with stunning valley views'
  },
  {
    name: 'Mooloolaba Circuit',
    distance: '10km',
    difficulty: 'Easy',
    description: 'Urban coastal tour with cafe stops'
  }
]

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Guided Electric Bike Tours
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Discover the hidden gems of Sunshine Coast with our expert local guides. 
              From coastal pathways to hinterland adventures, we'll show you the best of the region.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="#tours">
                <Button size="lg">
                  View Tours
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

      {/* Tour Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Tours?
            </h2>
            <p className="text-lg text-gray-600">
              Professional, safe, and unforgettable experiences with local expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tourFeatures.map((feature, index) => (
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

      {/* Tour Packages */}
      <section id="tours" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Tour Packages
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our carefully crafted tour experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tourPackages.map((tour, index) => (
              <motion.div
                key={tour.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {tour.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FaClock className="w-4 h-4 mr-1" />
                          {tour.duration}
                        </span>
                        <span className="flex items-center">
                          <FaUsers className="w-4 h-4 mr-1" />
                          {tour.groupSize}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {tour.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {tour.difficulty}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {tour.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Tour Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tour.highlights.map((highlight, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {tour.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="w-4 h-4 text-secondary mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    Book This Tour
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-lg text-gray-600">
              Explore our most loved cycling routes across Sunshine Coast
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <motion.div
                key={route.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{route.name}</h3>
                  <FaRoute className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span>{route.distance}</span>
                  <span>•</span>
                  <span>{route.difficulty}</span>
                </div>
                <p className="text-gray-600 text-sm">{route.description}</p>
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
              Ready for Your Adventure?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Book your guided tour today and discover Sunshine Coast's hidden gems
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