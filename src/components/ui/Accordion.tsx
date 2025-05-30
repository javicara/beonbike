'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  toggleOpen?: () => void;
}

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
  defaultOpen?: number | null;
  allowMultiple?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  toggleOpen
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  
  // Determine if using internal or external state
  const isItemOpen = toggleOpen ? isOpen : isOpenInternal;
  const toggleItem = toggleOpen || (() => setIsOpenInternal(!isOpenInternal));
  
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-4 px-2 text-left focus:outline-none"
        onClick={toggleItem}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <motion.div
          animate={{ rotate: isItemOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="text-gray-600" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isItemOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-4 text-gray-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen = null,
  allowMultiple = false
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpen !== null ? [defaultOpen] : []
  );
  
  const toggleItem = (index: number) => {
    if (allowMultiple) {
      // Toggle the clicked item
      setOpenIndices(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index) 
          : [...prev, index]
      );
    } else {
      // Only allow one open item at a time
      setOpenIndices(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-200">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndices.includes(index)}
          toggleOpen={() => toggleItem(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion; 