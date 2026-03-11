"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ImageUploadZoneProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/webp", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function ImageUploadZone({
  label,
  file,
  onFileChange,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const validateAndSet = useCallback(
    (f: File) => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        alert("Only JPEG, PNG, and WebP images are accepted.");
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        alert("File exceeds the 10 MB size limit.");
        return;
      }
      onFileChange(f);
    },
    [onFileChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) validateAndSet(f);
    },
    [validateAndSet]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) validateAndSet(f);
      if (inputRef.current) inputRef.current.value = "";
    },
    [validateAndSet]
  );

  if (file && previewUrl) {
    return (
      <div className="relative flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-4">
        <img
          src={previewUrl}
          alt={label}
          className="h-64 w-full rounded object-contain"
        />
        <p className="mt-2 text-xs text-gray-600 truncate max-w-full">
          {file.name}
        </p>
        <button
          onClick={() => onFileChange(null)}
          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs hover:bg-gray-700 transition-colors"
          aria-label="Remove image"
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${
        isDragging
          ? "border-black bg-gray-100"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-3 text-gray-400"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </svg>
      <p className="mb-1 text-sm font-medium text-black">{label}</p>
      <p className="text-xs text-gray-500">Drag & drop or click to browse</p>
      <p className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP only (max 10 MB)</p>
      <input
        ref={inputRef}
        type="file"
        accept=".jpeg,.jpg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
