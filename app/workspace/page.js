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
    width: 1000,
    height: 600,
  });

  const [dragEnabled, setDragEnabled] = useState(false);
  const dragStart = useRef(null);

  // Zoom function: zoom in or out by adjusting viewBox width and height
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

  // Reset zoom and position, disable drag
  const resetZoom = () => {
    setViewBox({ x: 0, y: 0, width: 1000, height: 600 });
    setDragEnabled(false);
  };

  // Enable or disable drag mode
  const toggleDrag = () => setDragEnabled((prev) => !prev);

  // Mouse down event on SVG - start dragging if drag enabled
  const onMouseDown = (e) => {
    if (!dragEnabled) return;
    e.preventDefault();
    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      viewBoxX: viewBox.x,
      viewBoxY: viewBox.y
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Mouse move - calculate delta and update viewBox x and y
  const onMouseMove = (e) => {
    if (!dragStart.current) return;

    const dx = e.clientX - dragStart.current.clientX;
    const dy = e.clientY - dragStart.current.clientY;

    // Calculate SVG coordinate system delta based on viewBox width/height and SVG pixel size
    // Assume SVG width and height in px is 1000 x 600 (same as initial viewBox)
    // To be accurate, use actual SVG element size (can be improved)

    const svgPixelWidth = 1000;  // If your SVG container width is fixed 1000px
    const svgPixelHeight = 600;  // If your SVG container height is fixed 600px

    // Convert pixel drag to viewBox coordinate shift (inversed because dragging left moves viewBox right)
    const xRatio = viewBox.width / svgPixelWidth;
    const yRatio = viewBox.height / svgPixelHeight;

    setViewBox((prev) => ({
      ...prev,
      x: dragStart.current.viewBoxX - dx * xRatio,
      y: dragStart.current.viewBoxY - dy * yRatio,
    }));
  };

  // Mouse up - stop dragging
  const onMouseUp = () => {
    dragStart.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };


  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Move the file state here
  const [fileName, setFileName] = useState('');
  const [columns, setColumns] = useState([]);

  return (
    <div className="flex h-screen w-screen">
      {/* Left Sidebar */}
      {isSidebarOpen && (
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
          <LeftSidebar
            fileName={fileName}
            setFileName={setFileName}
            columns={columns}
            setColumns={setColumns}
          />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white transition-all duration-300 flex flex-col">
        <div className="p-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition"
            title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div className="relative w-full h-screen">
          <ZoomableCanvas viewBox={viewBox} onMouseDown={onMouseDown} dragEnabled={dragEnabled} />
          <BottomToolbar
            onZoom={zoom}
            onReset={resetZoom}
            dragEnabled={dragEnabled}
            toggleDrag={toggleDrag}
          />
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[280px] bg-white border-l border-gray-200 sticky top-0 h-screen flex flex-col items-center py-4">
        <Rightsidebar />
      </aside>

    </div>
  );
}
