'use client';
import { useState } from 'react';
import LeftSidebar from './components/leftsidebar';
import Rightsidebar from './components/rightsidebar';
import BottomToolbar from './components/BottomToolbar';

export default function Workspace() {
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

        <div className="flex-1 flex justify-center items-center">
          <div className="text-2xl font-bold">Charts Show Case</div>
          <BottomToolbar />
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-70 bg-white border-l border-gray-200 flex flex-col items-center py-4">
        <Rightsidebar />
      </aside>
    </div>
  );
}
