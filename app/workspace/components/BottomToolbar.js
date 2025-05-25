'use client';

import { useState, useEffect, useRef } from 'react';
import { FaChartBar, FaPlay, FaPause, FaSearchPlus, FaSearchMinus, FaExpand, FaFileExport } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';

export default function BottomToolbar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartType, setChartType] = useState('Line');
  const [showChartOptions, setShowChartOptions] = useState(false);
  const chartDropdownRef = useRef(null);

  const chartOptions = ['Line', 'Bar', 'Pie'];

  // Toggle Play/Pause
  const togglePlay = () => setIsPlaying((prev) => !prev);

  // Spacebar for play/pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        chartDropdownRef.current &&
        !chartDropdownRef.current.contains(e.target)
      ) {
        setShowChartOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-xl p-3 flex items-center gap-3 border border-gray-200 z-50">
      
      {/* Chart Dropdown */}
      <div ref={chartDropdownRef} className="relative">
        <button
          onClick={() => setShowChartOptions(!showChartOptions)}
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          title="Select Chart Type"
        >
          <FaChartBar /> {chartType} <IoMdArrowDropdown />
        </button>

        {showChartOptions && (
          <div className="absolute bottom-full mb-2 left-0 bg-white border rounded shadow-md animate-fade-in-up z-10">
            {chartOptions.map((option) => (
              <div
                key={option}
                onClick={() => {
                  setChartType(option);
                  setShowChartOptions(false);
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap ${
                  chartType === option ? 'bg-blue-50 font-semibold text-blue-700' : ''
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Play / Pause Button */}
      <button
        onClick={togglePlay}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded"
        title="Play / Pause (Space)"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      {/* Zoom In */}
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded" title="Zoom In">
        <FaSearchPlus />
      </button>

      {/* Zoom Out */}
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded" title="Zoom Out">
        <FaSearchMinus />
      </button>

      {/* Page Fit */}
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded" title="Fit to Page">
        <FaExpand />
      </button>

      {/* Export Button */}
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded" title="Export">
        <FaFileExport />
      </button>
    </div>
  );
}
