import axios from 'axios';
import * as fastcsv from 'fast-csv';
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Replace with your YouTube API key

export async function POST(request: Request) {
  const body = await request.json();

  const { videoUrl, numComments } = body;

  try {
    const videoId = new URL(videoUrl).searchParams.get('v');
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=${numComments}&part=snippet`
    );

    const comments = response.data.items.map(
      (item: any) => item.snippet.topLevelComment.snippet.textDisplay
    );

    const csvData = comments.map((comment: any, index: any) => ({
      Index: index + 1,
      Comment: comment,
    }));

    // Create CSV content as a string
    const csvContent = await fastcsv.writeToString(csvData, { headers: true });

    // Convert CSV content to Uint8Array
    const encoder = new TextEncoder();
    const csvArray = encoder.encode(csvContent);

    // Set response headers
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/octet-stream');
    responseHeaders.set('Content-Disposition', 'attachment; filename=comments.csv');

    // Create a Blob from the Uint8Array and headers
    const csvBlob = new Blob([csvArray], { type: 'application/octet-stream' });

    // Create a Response with the Blob and headers
    const responseStream = new Response(csvBlob, { headers: responseHeaders });

    // Return the Response object
    return responseStream;
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    // Return an error response
    return NextResponse.json({ error: 'Error fetching comments' });
  }
}
