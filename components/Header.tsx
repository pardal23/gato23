
import React from 'react';
import { UploadIcon, ZipIcon, TrashIcon } from './icons';

interface HeaderProps {
  onImportClick: () => void;
  onExportAllClick: () => void;
  onClearAllClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onImportClick, onExportAllClick, onClearAllClick }) => {
  return (
    <header className="bg-gray-800 p-4 flex flex-wrap justify-between items-center border-b border-gray-700 shadow-md gap-4">
      <h1 className="text-xl font-bold text-cyan-400 tracking-wider">
        Stork 23 <span className="font-light text-gray-300">Pentest Studio</span>
      </h1>
      <div className="flex items-center space-x-2">
        <button
          onClick={onImportClick}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
          <UploadIcon className="w-5 h-5" />
          <span>Import</span>
        </button>
        <button
          onClick={onExportAllClick}
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
          <ZipIcon className="w-5 h-5" />
          <span>Export All (.zip)</span>
        </button>
        <button
          onClick={onClearAllClick}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Clear All</span>
        </button>
      </div>
    </header>
  );
};
