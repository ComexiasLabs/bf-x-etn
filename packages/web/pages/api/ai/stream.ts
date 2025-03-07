import { Config } from '@core/config/config';
import type { NextApiRequest, NextApiResponse } from 'next';

type StreamResponse = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<StreamResponse | { message: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const streamResponse = await fetch(Config.aiApiStreaming, {
      method: 'POST',
      headers: {
        'comexiaslabs-api-key': Config.aiApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!streamResponse.ok) {
      throw new Error(`API responded with status code ${streamResponse.status}`);
    }

    const reader = streamResponse.body.pipeThrough(new TextDecoderStream()).getReader();

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }

    res.end();
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
