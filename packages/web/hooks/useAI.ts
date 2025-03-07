import { Config } from '@core/config/config';
import { useState } from 'react';

const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  const generateErrorMessage = 'Could not run AI analysis. Please try a different model or try again later.';

  const generateAsStream = async (request) => {
    setIsLoading(true);

    try {
      const url = Config.aiApiStreaming;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'comexiaslabs-api-key': Config.aiApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response || !response.body) {
        return;
      }

      const reader = response.body.getReader();

      return new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setIsLoading(false);
              break;
            }
            controller.enqueue(value);
            const textChunk = new TextDecoder().decode(value, { stream: true });
            setOutput((prevText) => prevText + textChunk);
          }
          controller.close();
          reader.releaseLock();
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setOutput(generateErrorMessage);
    }
  };

  return { generateAsStream, isLoading, output };
};

export default useAI;
