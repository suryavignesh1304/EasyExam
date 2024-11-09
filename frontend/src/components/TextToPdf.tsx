import React, { useState } from 'react';
import axios from 'axios';

const TextToPdf: React.FC = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedFile, setGeneratedFile] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!text) {
          return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('https://exameasy.up.railway.app//text-to-pdf', { text });
            setGeneratedFile(response.data.filename);
        } catch (error) {
            setError('Error generating PDF. Please try again.');
            console.error('Error generating PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create PDF from Text</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="exam-text" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter exam text (follow the required format)
                    </label>
                    <textarea
                        id="exam-text"
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        placeholder="1. Question text...
(A) Option A
(B) Option B
(C) Option C
(D) Option D
**Answer:** A

2. Next question..."
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={!text || loading}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Generating PDF...' : 'Generate PDF'}
                </button>
            </form>
            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                    <p>{error}</p>
                </div>
            )}
            {generatedFile && (
                <div className="mt-4">
                    <p className="font-semibold">PDF generated successfully!</p>
                    <a
                        href={`https://exameasy.up.railway.app//${generatedFile}`}
                        download
                        className="mt-2 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Download Generated PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export default TextToPdf;