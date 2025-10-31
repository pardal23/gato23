
import React from 'react';
import type { StoredFile } from '../types';
import { FileItem } from './FileItem';

interface FileListProps {
  files: StoredFile[];
  onOpenFile: (id: number) => void;
  onDownloadFile: (id: number) => void;
  onDeleteFile: (id: number) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onOpenFile, onDownloadFile, onDeleteFile }) => {
  return (
    <div className="bg-gray-800/50 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-300 sticky top-0 bg-gray-800/50 py-2 -my-2 -mx-4 px-4 z-10">Stored Files</h2>
      {files.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p>No files stored.</p>
          <p className="text-sm">Use the "Import" button to add files.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()).map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onOpen={onOpenFile}
              onDownload={onDownloadFile}
              onDelete={onDeleteFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};
