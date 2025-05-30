import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaCheck } from 'react-icons/fa';
import { Button } from './Button';

interface Specification {
  [key: string]: string;
}

export interface ProductCardProps {
  name: string;
  shortDesc: string;
  price: string;
  imageUrl: string;
  specs: Specification;
  onContactClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  shortDesc,
  price,
  imageUrl,
  specs,
  onContactClick
}) => {
  const [showSpecs, setShowSpecs] = useState(false);
  
  const toggleSpecs = () => {
    setShowSpecs(!showSpecs);
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all h-full flex flex-col"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Product Image */}
      <div className="relative h-60 bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl || '/images/placeholder-bike.svg'}
          alt={name}
          fill
          className="object-contain p-4"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 mb-3">{shortDesc}</p>
        <div className="text-2xl font-bold text-blue-600 mb-4">{price}</div>
        
        {/* Specifications */}
        <div className={`transition-all duration-300 overflow-hidden ${showSpecs ? 'max-h-96' : 'max-h-0'}`}>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-700">{key}: </span>
                  <span className="text-gray-600">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex flex-col space-y-2">
          <Button 
            variant="outline" 
            onClick={toggleSpecs}
            className="flex items-center justify-center"
          >
            <FaInfoCircle className="mr-2" />
            {showSpecs ? 'Hide Specifications' : 'View Specifications'}
          </Button>
          
          <Button 
            variant="primary"
            onClick={onContactClick}
          >
            Contact for Purchase
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 