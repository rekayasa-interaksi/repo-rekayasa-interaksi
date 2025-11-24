import { React, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAllHistory } from '../../hooks/history.hook';

const formatApiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const HighlightYear = () => {
  const { histories: apiData, isLoading, error } = useAllHistory('year');

  const data = useMemo(() => {
    if (!apiData) return [];

    const sortedApiData = [...apiData].sort((a, b) => a.year - b.year);

    return sortedApiData.map((group) => ({
      year: group.year,
      events: group.histories.map((history) => ({
        title: history.title,
        date: formatApiDate(history.date),
        description: history.description,
        image: history.image_url
      }))
    }));
  }, [apiData]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    if (data.length > 0 && !selectedYear) {
      setSelectedYear(data[data.length - 1].year);
    }
  }, [data, selectedYear]);

  useEffect(() => {
    setCurrentEventIndex(0);
    if (!selectedYear) return;

    const eventsForYear = data.find((d) => d.year === selectedYear)?.events || [];

    if (eventsForYear.length > 1) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prev) => (prev + 1) % eventsForYear.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [selectedYear, data]);

  const currentData = data.find((d) => d.year === selectedYear);
  const currentEvent = currentData?.events[currentEventIndex];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p>Loading History...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p>Error loading history data.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <h1 className="text-4xl font-semibold">Digistar Club in Years</h1>
        <p className="text-gray-500">No history data available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-8 p-4 my-12 md:grid md:grid-cols-6 md:grid-rows-6 md:gap-y-4 md:h-[60vh] md:p-0 md:mx-24">
        <div className="md:col-span-3 md:row-span-2 md:pr-6">
          <h1 className="text-4xl font-semibold mb-4">Digistar Club in Years</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur. Scelerisque sed adipiscing nibh nulla morbi.
            Feugiat risus leo porttitor nullam neque dignissim placerat.
          </p>
        </div>

        <div className="h-80 md:h-full md:col-span-3 md:row-span-5 md:col-start-4">
          <div className="rounded-2xl h-full overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentEvent?.image}
                src={currentEvent?.image}
                alt={currentEvent?.title || 'Event Image'}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 w-full h-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="md:bg-gradient-to-l md:from-transparent md:via-background md:to-background md:col-span-3 md:row-span-3 md:row-start-3 md:rounded-l-xl p-4 md:p-6 overflow-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent?.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              {currentEvent && (
                <>
                  <h2 className="text-xl font-semibold mb-1">{currentEvent.title}</h2>
                  <h3 className="text-secondary text-sm mb-1">{currentEvent.date}</h3>
                  {currentEvent.description && (
                    <p className="text-sm mt-2">{currentEvent.description}</p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full relative py-4 md:py-6 md:col-span-6 md:row-start-6">
          <div className="absolute top-[1.7rem] md:top-[2.2rem] left-0 right-0 h-0.5 bg-black z-0" />
          <div className="flex justify-between items-end relative z-10 px-6">
            {data.map(({ year }) => {
              const isActive = year === selectedYear;
              return (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="flex flex-col items-center cursor-pointer group">
                  {isActive ? (
                    <div className="w-6 h-6 border-2 border-secondary rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-secondary rounded-full" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-3 h-3 bg-black rounded-full" />
                    </div>
                  )}
                  <span className="mt-2 text-sm font-semibold">{year}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightYear;
