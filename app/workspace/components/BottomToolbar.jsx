'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaChartBar,
  FaPlay,
  FaPause,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaFileExport,
  FaHandPaper,
} from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import * as echarts from 'echarts';

export default function BottomToolbar({
  onZoom,
  onReset,
  dragEnabled,
  toggleDrag,
  setChartType,
  setIsPlaying, // Add prop to update parent state
}) {
  const [isPlaying, setLocalIsPlaying] = useState(false);
  const [chartType, setLocalChartType] = useState('Bar');
  const [showChartOptions, setShowChartOptions] = useState(false);
  const chartDropdownRef = useRef(null);

  const chartOptions = ['Line', 'Bar', 'Pie'];

  // Sync chartType with parent
  useEffect(() => {
    setChartType(chartType.toLowerCase());
  }, [chartType, setChartType]);

  // Sync isPlaying with parent
  useEffect(() => {
    setIsPlaying(isPlaying);
  }, [isPlaying, setIsPlaying]);

  // Toggle Play/Pause
  const togglePlay = () => setLocalIsPlaying((prev) => !prev);

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

  // Export chart
  const handleExport = () => {
    const chartDom = document.querySelector('.bg-white');
    if (chartDom && chartDom.chartInstance) {
      const chartInstance = chartDom.chartInstance;
      const url = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart.png';
      a.click();
    } else {
      console.error('Chart instance not found for export');
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-xl p-3 flex items-center gap-3 border border-gray-200 z-50">
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
                  setLocalChartType(option);
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
      <button
        onClick={togglePlay}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded"
        title="Play / Pause (Space)"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button
        onClick={() => onZoom('in')}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded"
        title="Zoom In"
      >
        <FaSearchPlus />
      </button>
      <button
        onClick={() => onZoom('out')}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded"
        title="Zoom Out"
      >
        <FaSearchMinus />
      </button>
      <button
        onClick={toggleDrag}
        className={`bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded ${
          dragEnabled ? 'bg-blue-200 text-blue-700' : ''
        }`}
        title="Toggle Hand Tool (Drag to move chart)"
      >
        <FaHandPaper />
      </button>
      <button
        onClick={onReset}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded"
        title="Fit to Page"
      >
        <FaExpand />
      </button>
      <button
        onClick={handleExport}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded"
        title="Export"
      >
        <FaFileExport />
      </button>
    </div>
  );
}