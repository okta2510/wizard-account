'use client';

import { useRef, useState } from 'react';

interface FileUploadProps {
  onFileChange: (base64: string) => void;
  currentPhoto?: string;
}

export default function FileUpload({ onFileChange, currentPhoto }: FileUploadProps) {
  const [preview, setPreview] = useState<string>(currentPhoto || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onFileChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onFileChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-upload-input"
        id="photo-upload"
      />
      {!preview && (
        <label htmlFor="photo-upload" className="file-upload-label">
          <span>Choose Image</span>
        </label>
      )}
      {preview && (
        <div className="file-upload-preview">
          <img src={preview} alt="Preview" className="preview-image" />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
