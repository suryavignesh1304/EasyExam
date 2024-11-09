import React, { useState } from 'react';
import axios from 'axios';

const PdfConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedFile, setConvertedFile] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
          return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/convert-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setConvertedFile(response.data.filename);
        } catch (error) {
            setError('Error converting PDF. Please try again.');
            console.error('Error converting PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Convert PDF to CBT Format</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        Select PDF file to convert
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!file || loading}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Converting...' : 'Convert PDF'}
                </button>
            </form>
            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                    <p>{error}</p>
                </div>
            )}
            {convertedFile && (
                <div className="mt-4">
                    <p className="font-semibold">PDF converted successfully!</p>
                    <a
                        href={`http://localhost:5000/${convertedFile}`}
                        download
                        className="mt-2 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Download Converted PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export default PdfConverter;