import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { images } from '../../constants/imageConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faPlus, faInbox } from '@fortawesome/free-solid-svg-icons';
import { MarkdownConvert } from '../../utils/markdownConvert';
import { useFaqs } from '../../hooks/faq.hooks';
import ErrorCard from '../ui/ErrorCard';
import { FaqSkeleton } from '../ui/SkeletonLoad';
import { useLocation } from 'react-router-dom';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname; 

  const queryParams = {
    menu: currentPath,
    page: 1,
    limit: 6
  }
  
  const { faqs, isLoading, error, refetch } = useFaqs(queryParams);
  
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 w-[90%] mx-auto">
        <FaqSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message="Error loading FAQs" onRetry={refetch} />;
  }

  return (
    <div className="max-w-[85vw] mx-auto my-12 px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="md:col-span-1 hidden md:inline-block">
          <img loading="lazy" src={images.faq} alt={'FAQ illustration'} className="object-cover " />
        </div>

        <div className="">
          <h1 className="text-3xl md:text-3xl/tight 2xl:text-4xl/tight pb-4 font-medium border-b-2 border-primary/30">
            Frequently Asked Questions
          </h1>

          {faqs.length === 0 ? (
            <div className="border-b-2 border-primary/30 p-10 text-center">
              <FontAwesomeIcon icon={faInbox} className="h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-700">Data Empty</h3>
              <p className="mt-2 text-gray-500 text-medium">
                There are currently no frequently asked questions.
              </p>
            </div>
          ) : (
            faqs.map((faq, index) => (
              <div key={faq.id || index} className="border-b-2 border-primary/30 p-5">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left focus:outline-none">
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span className="text-xl text-primary">
                    {activeIndex === index ? (
                      <FontAwesomeIcon icon={faX} className="h-4 w-4" />
                    ) : (
                      <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden">
                      <div className="mt-2 text-gray-600">
                        <MarkdownConvert markdown={faq.answer} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
