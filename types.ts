
export interface StoredFile {
  id: number;
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
  textContent: string | null;
  created: string;
}
