
import React from 'react';
import { SaveIcon, LoadIcon, ExportIcon } from './icons';

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  onSaveLocal: () => void;
  onLoadLocal: () => void;
  onExportTxt: () => void;
}

export const Editor: React.FC<EditorProps> = ({ content, setContent, onSaveLocal, onLoadLocal, onExportTxt }) => {
  return (
    <div className="bg-gray-800/50 p-4 h-full flex flex-col">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold text-gray-300">Text Editor</h2>
        <div className="flex items-center space-x-2">
          <button onClick={onSaveLocal} title="Save to LocalStorage" className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
            <SaveIcon className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button onClick={onLoadLocal} title="Load from LocalStorage" className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
            <LoadIcon className="w-4 h-4" />
            <span>Load</span>
          </button>
          <button onClick={onExportTxt} title="Export as .txt" className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
            <ExportIcon className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Open a text file or start typing..."
        className="flex-grow w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-200 font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
      />
    </div>
  );
};
