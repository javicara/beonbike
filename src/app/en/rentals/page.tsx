'use client'

import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'


export default function RentalsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Electric Bike Rentals
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore Sunshine Coast the eco-friendly way! Rent our premium electric bikes 
              for your adventures, whether it's a quick trip or an extended stay.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            </div>
          </div>
        </div>
      </section>

      {/* Simple Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Rental Packages
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Choose from our flexible rental options
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h3 className="text-xl font-semibold mb-2">Hourly Rental</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">$25/hour</p>
                <p className="text-sm text-gray-500 mb-4">1-4 hours</p>
                <p className="text-gray-600 mb-4">Perfect for short trips and quick errands around town.</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Safety helmet</li>
                    <li>• Phone holder</li>
                    <li>• Security lock</li>
                  </ul>
                </div>
                
                <Button className="w-full">Book Now</Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-600 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold mb-2">Daily Rental</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">$60/day</p>
                <p className="text-sm text-gray-500 mb-4">Full day (8 hours)</p>
                <p className="text-gray-600 mb-4">Best value for tourists and day-long adventures.</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All accessories included</li>
                    <li>• GPS navigation</li>
                    <li>• Roadside assistance</li>
                    <li>• Route recommendations</li>
                  </ul>
                </div>
                
                <Button className="w-full">Book Now</Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h3 className="text-xl font-semibold mb-2">Weekly Rental</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">$210/week</p>
                <p className="text-sm text-gray-500 mb-4">7 days ($30/day)</p>
                <p className="text-gray-600 mb-4">Ideal for extended stays and serious exploration.</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Free maintenance service</li>
                    <li>• Premium accessories</li>
                    <li>• Multiple pickup locations</li>
                    <li>• Extended support</li>
                    <li>• Flexible return</li>
                  </ul>
                </div>
                
                <Button className="w-full">Book Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl mb-8">
              Book your electric bike rental today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="tel:+61403460777">
                <Button variant="outline" size="lg" className="bg-white text-blue-600 border-white hover:bg-gray-100">
                  Call Now
                </Button>
              </Link>
              
              <Link href="https://wa.me/61403460777">
                <Button variant="outline" size="lg" className="bg-white text-blue-600 border-white hover:bg-gray-100">
                  WhatsApp
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