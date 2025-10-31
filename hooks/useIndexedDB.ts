
import { useState, useEffect, useCallback } from 'react';
import type { StoredFile } from '../types';

const DB_NAME = "Stork23FileDB";
const STORE_NAME = "files";
const DB_VERSION = 1;

export const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      setDb(dbInstance);
      setIsReady(true);
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
      setIsReady(false);
    };

    return () => {
      db?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStore = useCallback((mode: IDBTransactionMode) => {
    if (!db) throw new Error("Database not initialized");
    const transaction = db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }, [db]);

  const addFile = useCallback(async (file: File | {name: string, type: string, size: number}, buffer: ArrayBuffer): Promise<number> => {
    return new Promise((resolve, reject) => {
      let textContent: string | null = null;
      try {
        const decoder = new TextDecoder("utf-8");
        const decoded = decoder.decode(buffer);
        // Heuristic to detect binary files: check for null characters
        if ((decoded.match(/\0/g) || []).length < decoded.length * 0.05) {
          textContent = decoded;
        }
      } catch (e) {
        // Not a text file, ignore error
      }

      const fileData: Omit<StoredFile, 'id'> = {
        name: file.name,
        type: file.type,
        size: buffer.byteLength,
        data: buffer,
        textContent,
        created: new Date().toISOString()
      };
      
      const store = getStore("readwrite");
      const request = store.add(fileData);
      
      request.onsuccess = (event) => resolve((event.target as IDBRequest).result as number);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }, [getStore]);

  const getFile = useCallback(async (id: number): Promise<StoredFile | undefined> => {
    return new Promise((resolve, reject) => {
      const store = getStore("readonly");
      const request = store.get(id);
      
      request.onsuccess = (event) => resolve((event.target as IDBRequest).result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }, [getStore]);

  const getAllFiles = useCallback(async (): Promise<StoredFile[]> => {
    return new Promise((resolve, reject) => {
      const store = getStore("readonly");
      const request = store.getAll();
      
      request.onsuccess = (event) => resolve((event.target as IDBRequest).result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }, [getStore]);

  const deleteFile = useCallback(async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const store = getStore("readwrite");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }, [getStore]);

  const clearDB = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const store = getStore("readwrite");
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }, [getStore]);

  return { isReady, addFile, getFile, getAllFiles, deleteFile, clearDB };
};
