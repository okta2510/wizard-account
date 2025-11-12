'use client';
import React, { useState } from 'react';
import FileUpload from '../Shared/FileUpload';
import ProgressBar from '../Shared/ProgressBar';

export default function BasicInfoForm() {

  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<string | File | null>(null); 
  const [progress, setProgress] = useState(0); 

  // allow passing arbitrary props to FileUpload without a type error
  const FileUploadAny = FileUpload as unknown as React.ComponentType<any>;
  // allow passing arbitrary props to ProgressBar without a type error
  const ProgressBarAny = ProgressBar as unknown as React.ComponentType<any>;


  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };


  const handleFileChange = (file: File | string | null) => {
    setAvatar(file);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form Submitted');
    console.log('Full Name:', fullName);
    console.log('Avatar:', avatar);


  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Full name
        <input 
          name="fullName" 
          value={fullName} 
          onChange={handleFullNameChange} 
        />
      </label>
      <br />
      <label>
        Avatar
        <FileUploadAny onChange={handleFileChange} />
      </label>
      <ProgressBarAny value={progress} />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
