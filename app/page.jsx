'use client'
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [numComments, setNumComments] = useState(10);
  const [responseData, setResponseData] = useState()

  const handleVideoUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleNumCommentsChange = (event) => {
    setNumComments(parseInt(event.target.value, 10));
  };

  const handleFetchComments = async () => {
    try {
      const response = await axios.post('/api/comments', {
        videoUrl,
        numComments,
      });

      setResponseData(response)

    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleDownload = () => {
    // Trigger the CSV download
    const blob = new Blob([responseData.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'comments.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className='px-32' >
      <h1 className=' my-5 text-2xl text-center' >Fetch YouTube Comments</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-600">
            YouTube Video URL:
          </label>
          <input
            type="text"
            id="videoUrl"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="Enter YouTube Video URL"
            className="border rounded-md w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numComments" className="block text-sm font-medium text-gray-600">
            Number of Comments:
          </label>
          <input
            type="number"
            id="numComments"
            value={numComments}
            onChange={handleNumCommentsChange}
            placeholder="Enter Number of Comments"
            className="border rounded-md w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="button" className='text-white cursor-pointer bg-black px-5 py-2 rounded-md' onClick={handleFetchComments}>
          Fetch Comments
        </button>
        {responseData &&
          <a
            className="block text-blue-500 mt-4 hover:underline cursor-pointer"
            onClick={handleDownload}
          >
            Download CSV
          </a>
        }
      </form>
    </div>
  );
}

