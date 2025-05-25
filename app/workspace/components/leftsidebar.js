'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, Settings, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import o from '../../public/JdCharts.png';

export default function LeftSidebar({ fileName, setFileName, columns, setColumns }) {
  const [activeTab, setActiveTab] = useState('files');
  const [searchText, setSearchText] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (fileName) return; // Prevent multiple uploads

    const file = acceptedFiles[0];
    setFileName(file.name);
    setShowDeletePopup(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0];
      setColumns(headers);
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const confirmDelete = () => {
    setFileName('');
    setColumns([]);
    setShowDeletePopup(false);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full px-5 py-6 shadow-sm relative">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <Image src={o} alt="Logo" width={40} height={40} className="mr-3 rounded-lg shadow-sm" />
        <span className="font-bold text-2xl text-gray-900 tracking-tight">JD Charts</span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-100 pb-2">
        {['files', 'templates'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium capitalize transition-colors duration-200 ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Accessibility Label */}
      <div className="text-xs text-gray-400 font-semibold mb-3 tracking-widest">Data center</div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {activeTab === 'files' && (
          <>
            {/* Upload Button - hide if a file is uploaded */}
            {!fileName && (
              <div
                {...getRootProps()}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border border-dashed border-gray-300 hover:bg-gray-100"
              >
                <input {...getInputProps()} />
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium text-sm">Upload Data</span>
              </div>
            )}

            {/* File Info and Delete Option */}
            {fileName && (
              <div className="mt-4 relative">
                <div className="flex items-center gap-2 text-sm text-gray-800 font-medium truncate">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>{fileName}</span>
                  <button
                    onClick={() => setShowDeletePopup(true)}
                    className="ml-auto text-gray-500 hover:text-gray-500 font-bold text-lg leading-none"
                    aria-label="Remove file"
                    title="close file"
                  >
                    ×
                  </button>
                </div>

                {showDeletePopup && (
                  <div className="absolute top-10 right-0 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-3 z-50">
                    <p className="text-sm mb-3 text-gray-800">Delete this file?</p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={confirmDelete}
                        className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-black"
                      >
                        Yes
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Columns List */}
            {columns.length > 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded">
                <div className="relative">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search columns"
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  {searchText && (
                    <button
                      onClick={() => setSearchText('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <ul className="mt-3 space-y-2 max-h-48 overflow-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                  {columns
                    .filter((col) => col?.toLowerCase().includes(searchText.toLowerCase()))
                    .map((col, index) => {
                      const matchIndex = col.toLowerCase().indexOf(searchText.toLowerCase());
                      const beforeMatch = col.slice(0, matchIndex);
                      const matchText = col.slice(matchIndex, matchIndex + searchText.length);
                      const afterMatch = col.slice(matchIndex + searchText.length);

                      return (
                        <li
                          key={index}
                          className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-800"
                        >
                          {beforeMatch}
                          <mark className="bg-yellow-200 text-black font-semibold">{matchText}</mark>
                          {afterMatch}
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </>
        )}

        {activeTab === 'templates' && <></>}
      </nav>

      {/* Footer */}
      <div className="mt-8 w-full flex flex-col items-left gap-1">
        <div className="flex items-center text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 font-medium cursor-pointer">
          <Settings className="w-5 h-5 mr-3" />
          User Settings
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-xl font-semibold shadow hover:from-green-600 hover:to-blue-600 transition"
        >
          Upgrade Plan
        </motion.button>
        <span className="text-xs text-center text-gray-400 mt-2">© 2025 Developed By JD Siva</span>
      </div>
    </aside>
  );
}
