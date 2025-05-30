'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { FaPhone, FaWhatsapp, FaSms } from 'react-icons/fa';
import LocalizedSeo from '@/components/LocalizedSeo';
import ProductCard from '@/components/ui/ProductCard';
import ImageGallery from '@/components/ImageGallery';
import Accordion from '@/components/ui/Accordion';

// Helper function to safely get translations with fallbacks
function getSafeTranslation(translationFunc: any, key: string, fallback: string): string {
  try {
    return translationFunc(key);
  } catch (error) {
    return fallback;
  }
}

export default function ElectricBikeSalesPage() {
  const locale = useLocale();
  
  // Define fallback default translations
  const defaultTranslations = {
    title: 'Electric Bike Sales',
    subtitle: 'Premium Electric Bikes with Bafang Motors',
    description: 'Explore our range of high-quality electric bikes featuring powerful Bafang motors. Perfect for commuting, adventure, or leisure rides across Sunshine Coast.',
    cta: {
      contact: 'Contact Us',
      call: 'Call Us',
      whatsapp: 'WhatsApp',
      sms: 'Send SMS'
    },
    sections: {
      catalog: 'Our Electric Bikes',
      bafang: 'Bafang Motor Technology',
      specs: 'Specifications',
      gallery: 'Image Gallery',
      faq: 'Frequently Asked Questions'
    },
    bafang: {
      title: 'Why Choose Bafang Motors?',
      reliability: 'Industry-leading reliability',
      performance: 'Exceptional performance and torque',
      efficiency: 'Maximum energy efficiency',
      warranty: '2-year comprehensive warranty'
    },
    products: {
      cityRider: {
        name: 'City Rider Pro',
        shortDesc: 'Urban commuter with style and power',
        price: '$1,899',
        specs: {
          motor: 'Bafang 250W mid-drive',
          battery: '48V 13Ah (624Wh)',
          range: 'Up to 100km',
          speed: '25km/h (legal limit)',
          weight: '22kg',
          frame: 'Aluminum alloy'
        }
      },
      mountainExplorer: {
        name: 'Mountain Explorer X',
        shortDesc: 'Conquer any trail with confidence',
        price: '$2,499',
        specs: {
          motor: 'Bafang 350W mid-drive',
          battery: '48V 17.5Ah (840Wh)',
          range: 'Up to 120km',
          speed: '25km/h (legal limit)',
          weight: '24kg',
          frame: 'Aluminum alloy, front suspension'
        }
      },
      beachCruiser: {
        name: 'Beach Cruiser Elite',
        shortDesc: 'Stylish comfort for coastal rides',
        price: '$2,199',
        specs: {
          motor: 'Bafang 250W rear hub',
          battery: '48V 14Ah (672Wh)',
          range: 'Up to 90km',
          speed: '25km/h (legal limit)',
          weight: '23kg',
          frame: 'Step-through aluminum'
        }
      },
      cargoMax: {
        name: 'Cargo Max Utility',
        shortDesc: 'The ultimate utility e-bike',
        price: '$2,899',
        specs: {
          motor: 'Bafang 500W mid-drive',
          battery: '48V 20Ah (960Wh)',
          range: 'Up to 80km (with cargo)',
          speed: '25km/h (legal limit)',
          weight: '30kg',
          frame: 'Reinforced aluminum, rear rack'
        }
      }
    }
  };
  
  // Initialize translation hooks
  let tBikes: any = null;
  let tCta: any = null;
  
  try {
    // Try to get translation functions
    tBikes = useTranslations('bikes');
    tCta = useTranslations('cta');
    
    // Update with actual translations, using safe translation function
    defaultTranslations.title = getSafeTranslation(tBikes, 'title', defaultTranslations.title);
    defaultTranslations.subtitle = getSafeTranslation(tBikes, 'subtitle', defaultTranslations.subtitle);
    defaultTranslations.description = getSafeTranslation(tBikes, 'description', defaultTranslations.description);
    
    defaultTranslations.sections.catalog = getSafeTranslation(tBikes, 'sections.catalog', defaultTranslations.sections.catalog);
    defaultTranslations.sections.bafang = getSafeTranslation(tBikes, 'sections.bafang', defaultTranslations.sections.bafang);
    defaultTranslations.sections.specs = getSafeTranslation(tBikes, 'sections.specs', defaultTranslations.sections.specs);
    defaultTranslations.sections.gallery = getSafeTranslation(tBikes, 'sections.gallery', defaultTranslations.sections.gallery);
    defaultTranslations.sections.faq = getSafeTranslation(tBikes, 'sections.faq', defaultTranslations.sections.faq);
    
    defaultTranslations.cta.contact = getSafeTranslation(tCta, 'contact', defaultTranslations.cta.contact);
    defaultTranslations.cta.call = getSafeTranslation(tCta, 'call', defaultTranslations.cta.call);
    defaultTranslations.cta.whatsapp = getSafeTranslation(tCta, 'whatsapp', defaultTranslations.cta.whatsapp);
    defaultTranslations.cta.sms = getSafeTranslation(tCta, 'sms', defaultTranslations.cta.sms);
    
    // Bafang motor section translations
    defaultTranslations.bafang.title = getSafeTranslation(tBikes, 'bafang.title', defaultTranslations.bafang.title);
    defaultTranslations.bafang.reliability = getSafeTranslation(tBikes, 'bafang.reliability', defaultTranslations.bafang.reliability);
    defaultTranslations.bafang.performance = getSafeTranslation(tBikes, 'bafang.performance', defaultTranslations.bafang.performance);
    defaultTranslations.bafang.efficiency = getSafeTranslation(tBikes, 'bafang.efficiency', defaultTranslations.bafang.efficiency);
    defaultTranslations.bafang.warranty = getSafeTranslation(tBikes, 'bafang.warranty', defaultTranslations.bafang.warranty);
    
    // Try to get product translations
    try {
      defaultTranslations.products.cityRider.name = getSafeTranslation(tBikes, 'products.cityRider.name', defaultTranslations.products.cityRider.name);
      defaultTranslations.products.cityRider.shortDesc = getSafeTranslation(tBikes, 'products.cityRider.shortDesc', defaultTranslations.products.cityRider.shortDesc);
      defaultTranslations.products.cityRider.price = getSafeTranslation(tBikes, 'products.cityRider.price', defaultTranslations.products.cityRider.price);
      
      defaultTranslations.products.mountainExplorer.name = getSafeTranslation(tBikes, 'products.mountainExplorer.name', defaultTranslations.products.mountainExplorer.name);
      defaultTranslations.products.mountainExplorer.shortDesc = getSafeTranslation(tBikes, 'products.mountainExplorer.shortDesc', defaultTranslations.products.mountainExplorer.shortDesc);
      defaultTranslations.products.mountainExplorer.price = getSafeTranslation(tBikes, 'products.mountainExplorer.price', defaultTranslations.products.mountainExplorer.price);
      
      defaultTranslations.products.beachCruiser.name = getSafeTranslation(tBikes, 'products.beachCruiser.name', defaultTranslations.products.beachCruiser.name);
      defaultTranslations.products.beachCruiser.shortDesc = getSafeTranslation(tBikes, 'products.beachCruiser.shortDesc', defaultTranslations.products.beachCruiser.shortDesc);
      defaultTranslations.products.beachCruiser.price = getSafeTranslation(tBikes, 'products.beachCruiser.price', defaultTranslations.products.beachCruiser.price);
      
      defaultTranslations.products.cargoMax.name = getSafeTranslation(tBikes, 'products.cargoMax.name', defaultTranslations.products.cargoMax.name);
      defaultTranslations.products.cargoMax.shortDesc = getSafeTranslation(tBikes, 'products.cargoMax.shortDesc', defaultTranslations.products.cargoMax.shortDesc);
      defaultTranslations.products.cargoMax.price = getSafeTranslation(tBikes, 'products.cargoMax.price', defaultTranslations.products.cargoMax.price);
      
      // Translation for specifications
      for (const product of Object.keys(defaultTranslations.products)) {
        for (const spec of Object.keys(defaultTranslations.products[product as keyof typeof defaultTranslations.products].specs)) {
          const translationPath = `products.${product}.specs.${spec}`;
          const productKey = product as keyof typeof defaultTranslations.products;
          const specKey = spec as keyof typeof defaultTranslations.products[typeof productKey]['specs'];
          
          defaultTranslations.products[productKey].specs[specKey] = getSafeTranslation(
            tBikes, 
            translationPath, 
            defaultTranslations.products[productKey].specs[specKey]
          );
        }
      }
    } catch (error) {
      console.warn('Product translations not fully available, using defaults');
    }
  } catch (error) {
    console.error('Error loading translations:', error);
    // Already using fallbacks from defaultTranslations
  }

  const { title, subtitle, description, cta, sections, products, bafang } = defaultTranslations;
  
  // Handle contact click
  const handleContactClick = () => {
    // Scroll to contact section or open contact modal
    window.location.href = 'tel:+61412345678';
  };

  return (
    <>
      <LocalizedSeo
        title={title}
        description={description}
        path="/bikes"
      />
      
      <div id="electric-bikes-content">
        {/* Header Section */}
        <section id="bikes-header" className="relative py-20 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
              >
                {title}
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl mb-6 text-blue-300"
              >
                {subtitle}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg max-w-3xl mx-auto mb-8 text-gray-300"
              >
                {description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <a href="tel:+61412345678" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <FaPhone />
                  <span>{cta.call}</span>
                </a>
                
                <a href="https://wa.me/61412345678" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <FaWhatsapp />
                  <span>{cta.whatsapp}</span>
                </a>
                
                <a href="sms:+61412345678" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-colors">
                  <FaSms />
                  <span>{cta.sms}</span>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Catalog Section */}
        <section id="product-catalog" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{sections.catalog}</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ProductCard
                name={products.cityRider.name}
                shortDesc={products.cityRider.shortDesc}
                price={products.cityRider.price}
                imageUrl="/images/bike-city.svg"
                specs={products.cityRider.specs}
                onContactClick={handleContactClick}
              />
              
              <ProductCard
                name={products.mountainExplorer.name}
                shortDesc={products.mountainExplorer.shortDesc}
                price={products.mountainExplorer.price}
                imageUrl="/images/bike-mountain.svg"
                specs={products.mountainExplorer.specs}
                onContactClick={handleContactClick}
              />
              
              <ProductCard
                name={products.beachCruiser.name}
                shortDesc={products.beachCruiser.shortDesc}
                price={products.beachCruiser.price}
                imageUrl="/images/bike-beach.svg"
                specs={products.beachCruiser.specs}
                onContactClick={handleContactClick}
              />
              
              <ProductCard
                name={products.cargoMax.name}
                shortDesc={products.cargoMax.shortDesc}
                price={products.cargoMax.price}
                imageUrl="/images/bike-cargo.svg"
                specs={products.cargoMax.specs}
                onContactClick={handleContactClick}
              />
            </div>
            
            <div className="mt-12 text-center">
              <p className="mb-6 text-gray-600">Looking for something specific? Contact us for custom builds and options.</p>
              <Button variant="primary" size="lg" onClick={handleContactClick}>
                Contact for Custom Options
              </Button>
            </div>
          </div>
        </section>

        {/* Bafang Motor Section */}
        <section id="bafang-motor" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{sections.bafang}</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image 
                    src="/images/bafang-motor.svg" 
                    alt="Bafang Motor Technology"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  {bafang.title}
                </h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">
                        {bafang.reliability}
                      </h4>
                      <p className="text-gray-600">
                        Bafang motors are engineered to withstand years of daily use in various conditions with minimal maintenance requirements.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">
                        {bafang.performance}
                      </h4>
                      <p className="text-gray-600">
                        Experience smooth acceleration, impressive hill-climbing ability, and consistent power delivery throughout your ride.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">
                        {bafang.efficiency}
                      </h4>
                      <p className="text-gray-600">
                        Bafang's advanced motor technology optimizes battery usage, providing longer range and reduced charging frequency.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">
                        {bafang.warranty}
                      </h4>
                      <p className="text-gray-600">
                        All our Bafang motors come with a 2-year warranty and are backed by our professional service and support team.
                      </p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Button variant="primary" onClick={handleContactClick}>
                    {cta.contact}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-16 bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-bold text-lg mb-3 text-blue-600">Mid-Drive Motors</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Power: 250W (EU legal), 350W, 500W, 750W</li>
                    <li>• Torque: 80Nm - 120Nm</li>
                    <li>• Multiple assist levels</li>
                    <li>• Integrated torque sensors</li>
                    <li>• Cadence-based assist</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-bold text-lg mb-3 text-blue-600">Hub Motors</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Power: 250W (EU legal), 350W, 500W</li>
                    <li>• Torque: 45Nm - 80Nm</li>
                    <li>• Low maintenance design</li>
                    <li>• Regenerative braking capability</li>
                    <li>• Weatherproof construction</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-bold text-lg mb-3 text-blue-600">Controller System</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Color LCD displays</li>
                    <li>• Smartphone connectivity</li>
                    <li>• Customizable power modes</li>
                    <li>• Battery level monitoring</li>
                    <li>• Range estimation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section id="image-gallery" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{sections.gallery}</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
              <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                {getSafeTranslation(tBikes, 'gallery.description', 'Explore our electric bikes from every angle. Click on any image to view in full size.')}
              </p>
            </motion.div>
            
            <div className="mb-12">
              <ImageGallery 
                images={[
                  { src: '/images/gallery-1.svg', alt: 'Electric bike front view' },
                  { src: '/images/gallery-2.svg', alt: 'Electric bike side view' },
                  { src: '/images/gallery-3.svg', alt: 'Electric bike detail view of motor' },
                  { src: '/images/gallery-4.svg', alt: 'Electric bike battery compartment' },
                  { src: '/images/gallery-5.svg', alt: 'Person riding electric bike' },
                  { src: '/images/gallery-6.svg', alt: 'Electric bike dashboard display' }
                ]}
                columns={3}
                gap={6}
              />
            </div>
            
            <div className="text-center">
              <Button variant="outline" size="lg" onClick={handleContactClick}>
                {getSafeTranslation(tBikes, 'gallery.cta', 'Request More Photos')}
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{sections.faq}</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
              <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                {getSafeTranslation(tBikes, 'faq.description', 'Find answers to the most common questions about our electric bikes, purchasing process, and after-sales services.')}
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion
                items={[
                  {
                    title: getSafeTranslation(tBikes, 'faq.q1', 'What is the range of your electric bikes?'),
                    content: (
                      <p>
                        {getSafeTranslation(tBikes, 'faq.a1', 'Our electric bikes offer ranges from 60km to 120km on a single charge, depending on the model, terrain, rider weight, and level of pedal assist. The exact specifications for each model are listed in the product details above.')}
                      </p>
                    )
                  },
                  {
                    title: getSafeTranslation(tBikes, 'faq.q2', 'How long does it take to charge the battery?'),
                    content: (
                      <p>
                        {getSafeTranslation(tBikes, 'faq.a2', 'A complete charge typically takes 4-6 hours. All our bikes use high-quality lithium-ion batteries with smart charging technology to prevent overcharging. We recommend charging your battery after each ride for optimal performance.')}
                      </p>
                    )
                  },
                  {
                    title: getSafeTranslation(tBikes, 'faq.q3', 'Are your electric bikes legal on Australian roads?'),
                    content: (
                      <p>
                        {getSafeTranslation(tBikes, 'faq.a3', 'Yes, all our electric bikes comply with Australian regulations, which require electric bikes to have a maximum power output of 250W and a top speed of 25km/h with pedal assist. No license is needed to ride them on public roads and bike paths.')}
                      </p>
                    )
                  },
                  {
                    title: getSafeTranslation(tBikes, 'faq.q4', 'Do I need to pedal, or can I use the motor only?'),
                    content: (
                      <p>
                        {getSafeTranslation(tBikes, 'faq.a4', 'Our bikes are pedal-assist systems (PAS), which means the motor provides power only when you pedal. This design is both legally compliant and offers a more natural riding experience. The level of assistance can be adjusted to match your preference and terrain.')}
                      </p>
                    )
                  },
                  {
                    title: getSafeTranslation(tBikes, 'faq.q5', 'What warranty do you offer?'),
                    content: (
                      <p>
                        {getSafeTranslation(tBikes, 'faq.a5', 'We provide a 2-year warranty on all Bafang motors, a 1-year warranty on batteries, and a 5-year warranty on frames. Regular maintenance is required to maintain warranty coverage. Detailed warranty information is provided with each purchase.')}
                      </p>
                    )
                  },
                  {
                    title: getSafeTranslation(tBikes, 'faq.q6', 'Do you offer after-sales service and maintenance?'),
                    content: (
                      <p>
                        {getSafeTranslation(tBikes, 'faq.a6', 'Yes, we provide comprehensive after-sales service, including regular maintenance, repairs, and component upgrades. Our Sunshine Coast workshop is fully equipped to service all electric bike components, and we stock a wide range of spare parts for quick turnaround.')}
                      </p>
                    )
                  },
                  {
                    title: getSafeTranslation(tBikes, 'faq.q7', 'Can I test ride before purchasing?'),
                    content: (
                      <p>
                        {getSafeTranslation(tBikes, 'faq.a7', 'Absolutely! We encourage test rides to ensure you choose the right bike for your needs. Visit our Sunshine Coast location or contact us to arrange a test ride appointment. We have all models available for testing on various terrains.')}
                      </p>
                    )
                  }
                ]}
                defaultOpen={0}
              />
              
              <div className="mt-12 text-center">
                <p className="mb-4 text-gray-600">
                  {getSafeTranslation(tBikes, 'faq.moreQuestions', 'Have more questions? We\'re here to help!')}
                </p>
                <Button variant="primary" onClick={handleContactClick}>
                  {cta.contact}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 