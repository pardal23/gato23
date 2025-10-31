
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { FileList } from './components/FileList';
import { Editor } from './components/Editor';
import { useIndexedDB } from './hooks/useIndexedDB';
import type { StoredFile } from './types';

// Declare JSZip for TypeScript
declare const JSZip: any;

const LOCAL_STORAGE_KEY = "stork23_editor_text";

const App: React.FC = () => {
  const { isReady, addFile, getFile, getAllFiles, deleteFile, clearDB } = useIndexedDB();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [editorContent, setEditorContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshFiles = useCallback(async () => {
    if (isReady) {
      try {
        const allFiles = await getAllFiles();
        setFiles(allFiles);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        alert("Error: Could not load files from the database.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [isReady, getAllFiles]);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    alert(`Importing ${selectedFiles.length} item(s)...`);

    for (const file of selectedFiles) {
      try {
        if (file.name.toLowerCase().endsWith('.zip')) {
          const zip = await JSZip.loadAsync(file);
          for (const filename in zip.files) {
            if (!zip.files[filename].dir) {
              const content = await zip.files[filename].async('arraybuffer');
              const fakeFile = {
                  name: filename,
                  type: 'application/octet-stream',
                  size: content.byteLength,
              };
              await addFile(fakeFile, content);
            }
          }
        } else {
          const buffer = await file.arrayBuffer();
          await addFile(file, buffer);
        }
      } catch (error) {
        console.error(`Failed to import ${file.name}:`, error);
        alert(`Error importing ${file.name}. See console for details.`);
      }
    }
    
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    await refreshFiles();
    alert("Import complete!");
  };

  const handleOpenFile = async (id: number) => {
    try {
      const file = await getFile(id);
      if (file) {
        setEditorContent(file.textContent ?? `[Binary file: ${file.name} - Not displayable]`);
      }
    } catch (error) {
      console.error("Failed to open file:", error);
      alert("Could not open the selected file.");
    }
  };

  const handleDownloadFile = async (id: number) => {
    try {
        const file = await getFile(id);
        if (!file) return;

        const blob = new Blob([file.data], { type: file.type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to download file:", error);
        alert("Could not download the file.");
    }
  };
  
  const handleDeleteFile = async (id: number) => {
      if (window.confirm("Are you sure you want to delete this file?")) {
          try {
              await deleteFile(id);
              await refreshFiles();
          } catch (error) {
              console.error("Failed to delete file:", error);
              alert("Could not delete the file.");
          }
      }
  };
  
  const handleExportAll = async () => {
    if (files.length === 0) {
        alert("No files to export.");
        return;
    }
    try {
        const zip = new JSZip();
        files.forEach(file => {
            zip.file(file.name, file.data);
        });
        const blob = await zip.generateAsync({ type: 'blob' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "stork23_backup.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to export files:", error);
        alert("Could not export files as ZIP.");
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete ALL stored files? This cannot be undone.")) {
        try {
            await clearDB();
            await refreshFiles();
            setEditorContent('');
        } catch (error) {
            console.error("Failed to clear database:", error);
            alert("Could not clear all files.");
        }
    }
  };

  const handleSaveLocal = () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, editorContent);
      alert("Text saved to browser's local storage.");
  };

  const handleLoadLocal = () => {
      const savedText = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedText) {
          setEditorContent(savedText);
      } else {
          alert("No text found in local storage.");
      }
  };

  const handleExportTxt = () => {
      const blob = new Blob([editorContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited_text.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      <Header
        onImportClick={() => fileInputRef.current?.click()}
        onExportAllClick={handleExportAll}
        onClearAllClick={handleClearAll}
      />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        {isLoading ? (
            <div className="col-span-2 flex items-center justify-center text-gray-400">Loading database...</div>
        ) : (
            <>
                <div className="flex flex-col h-full overflow-hidden rounded-lg border border-gray-700">
                    <FileList
                        files={files}
                        onOpenFile={handleOpenFile}
                        onDownloadFile={handleDownloadFile}
                        onDeleteFile={handleDeleteFile}
                    />
                </div>
                <div className="flex flex-col h-full overflow-hidden rounded-lg border border-gray-700">
                    <Editor
                        content={editorContent}
                        setContent={setEditorContent}
                        onSaveLocal={handleSaveLocal}
                        onLoadLocal={handleLoadLocal}
                        onExportTxt={handleExportTxt}
                    />
                </div>
            </>
        )}
      </main>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        className="hidden"
        multiple
        accept="*"
      />
    </div>
  );
};

export default App;
