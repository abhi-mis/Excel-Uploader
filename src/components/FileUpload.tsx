import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

interface UploadResult {
  success: number;
  skipped: number;
  errors: string[];
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData);
      setResult(response.data.results);
    } catch (err) {
      setError('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="w-8 h-8 text-gray-500" />
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Click to upload Excel file'}
            </span>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Candidates'}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="w-full p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span>Upload Complete</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Successfully added: {result.success}</p>
              <p>Skipped (duplicates): {result.skipped}</p>
              {result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Errors:</p>
                  <ul className="list-disc list-inside">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}