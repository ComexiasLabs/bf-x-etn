import { Config } from '@core/config/config';
import useAI from 'hooks/useAI';
import type { NextPage } from 'next';
import { useState } from 'react';
import Markdown from 'react-markdown';

const TestPage: NextPage = () => {
  const { generateAsStream, isLoading, output } = useAI();

  const handleClick = async () => {
    console.log('handleClick');
    // const request = {
    //     "modelId": "anthropic.claude-3-sonnet-20240229-v1:0",
    //     "prompt": "Write a short description Kyoto within 200 words.",
    //     "options": {
    //         "temperature": 0.5,
    //         "topP": 0.5,
    //         "maxGenerationLength": 1000
    //     }
    // };
    // await generateAsStream(request);
  };

  return (
    <div>
      <button onClick={() => handleClick()}>Execute</button>
      {/* 
      <div
        style={{
          border: 'solid 1px #bebebe',
          borderRadius: 5,
          padding: 16,
          fontFamily: 'Roboto',
          color: '#333333',
        }}
      >
        <Markdown>{output}</Markdown>
      </div> */}
    </div>
  );
};

export default TestPage;
