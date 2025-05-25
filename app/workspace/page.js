'use client';
import { useState, useRef } from 'react';
import LeftSidebar from './components/leftsidebar';
import Rightsidebar from './components/rightsidebar';
import BottomToolbar from './components/BottomToolbar';
import ZoomableCanvas from './components/ZoomableCanvas';

export default function Workspace() {
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 1500,
    height: 900,
  });
  const [dragEnabled, setDragEnabled] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [isPlaying, setIsPlaying] = useState(false); // Add isPlaying state
  const dragStart = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [fileName, setFileName] = useState('');
  const [columns, setColumns] = useState([]);

  const zoom = (inOrOut) => {
    const factor = inOrOut === 'in' ? 0.8 : 1.25;
    setViewBox((prev) => {
      const newWidth = prev.width * factor;
      const newHeight = prev.height * factor;
      const newX = prev.x + (prev.width - newWidth) / 2;
      const newY = prev.y + (prev.height - newHeight) / 2;
      return { x: newX, y: newY, width: newWidth, height: newHeight };
    });
  };

  const resetZoom = () => {
    setViewBox({ x: 0, y: 0, width: 1500, height: 900 });
    setDragEnabled(false);
    setIsPlaying(false); // Stop animation on reset
  };

  const toggleDrag = () => setDragEnabled((prev) => !prev);

  const onMouseDown = (e) => {
    if (!dragEnabled) return;
    e.preventDefault();
    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      viewBoxX: viewBox.x,
      viewBoxY: viewBox.y,
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.clientX;
    const dy = e.clientY - dragStart.current.clientY;
    const sidebarWidth = isSidebarOpen ? 240 : 0;
    const rightSidebarWidth = 280;
    const svgPixelWidth = window.innerWidth - sidebarWidth - rightSidebarWidth;
    const svgPixelHeight = window.innerHeight;
    const xRatio = viewBox.width / svgPixelWidth;
    const yRatio = viewBox.height / svgPixelHeight;
    setViewBox((prev) => {
      let newX = dragStart.current.viewBoxX + dx * xRatio;
      let newY = dragStart.current.viewBoxY + dy * yRatio;
      const maxX = viewBox.width / 2;
      const minX = -viewBox.width / 2;
      const maxY = viewBox.height / 2;
      const minY = -viewBox.height / 2;
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
      return { ...prev, x: newX, y: newY };
    });
  };

  const onMouseUp = () => {
    dragStart.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="flex h-screen w-screen">
      {isSidebarOpen && (
        <aside className="relative w-60 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <LeftSidebar
            fileName={fileName}
            setFileName={setFileName}
            columns={columns}
            setColumns={setColumns}
          />
        </aside>
      )}
      <main className=" relative flex-1 bg-white transition-all duration-300 flex flex-col overflow-hidden">
        <div className="p-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className=" bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition"
            title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          >
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="relative w-full h-screen">
          <ZoomableCanvas
            viewBox={viewBox}
            onMouseDown={onMouseDown}
            dragEnabled={dragEnabled}
            chartType={chartType}
            isPlaying={isPlaying} // Pass isPlaying
          />
          <BottomToolbar
            onZoom={zoom}
            onReset={resetZoom}
            dragEnabled={dragEnabled}
            toggleDrag={toggleDrag}
            setChartType={setChartType}
            setIsPlaying={setIsPlaying} // Pass setIsPlaying
          />
        </div>
      </main>
      <aside className="w-[280px] bg-white border-l border-gray-200 sticky top-0 h-screen flex flex-col items-center py-4">
        <Rightsidebar />
      </aside>
    </div>
  );
}