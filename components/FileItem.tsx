
import React from 'react';
import type { StoredFile } from '../types';
import { formatBytes } from '../lib/utils';
import { FileIcon, OpenIcon, DownloadIcon, TrashIcon } from './icons';

interface FileItemProps {
  file: StoredFile;
  onOpen: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
}

export const FileItem: React.FC<FileItemProps> = ({ file, onOpen, onDownload, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
      <div className="flex items-center space-x-3 truncate min-w-0">
        <FileIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
        <div className="truncate">
          <p className="font-semibold truncate text-gray-200">{file.name}</p>
          <p className="text-xs text-gray-400">{formatBytes(file.size)} - {new Date(file.created).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <button onClick={() => onOpen(file.id)} title="Open in Editor" className="p-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-colors">
          <OpenIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onDownload(file.id)} title="Download" className="p-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-colors">
          <DownloadIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(file.id)} title="Delete" className="p-2 rounded-full hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
