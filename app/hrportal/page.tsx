"use client";
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const HRPortal = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      
      // Check if the file is an Excel file
      if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(selectedFile);
        setError(''); // Clear any previous errors
      } else {
        setError('Please upload a valid Excel file (.xlsx)');
        setFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('No file selected or invalid file type');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Uploading...');
      const response = await axios.post('/upload', formData);

      if (response.status === 200) {
        setStatus('Processing...');
        // Simulate a delay for processing
        setTimeout(() => {
          setStatus('File parsed and PDF generated successfully!');
        }, 2000);
      } else {
        setStatus(''); // Clear status if not successful
        setError('Upload failed: ' + response.statusText);
      }

    } catch (err) {
      setStatus('');
      setError('Upload failed');
    }
  };

  return (
    <div className='h-screen bg-[#1A1A1D] p-4 flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold text-white mb-4'>HR Portal</h1>
      
      <div className='flex flex-col items-center'>
        <input 
          type='file' 
          accept='.xlsx'
          onChange={handleFileChange} 
          className='mb-4 p-2 border border-gray-300 rounded text-white'
        />
        <button 
          onClick={handleFileUpload} 
          className='bg-blue-500 text-white p-2 rounded'
        >
          Upload File
        </button>
        {status && <p className='mt-4 text-white'>{status}</p>}
        {error && <p className='mt-4 text-red-500'>{error}</p>}
      </div>
    </div>
  );
}

export default HRPortal;
