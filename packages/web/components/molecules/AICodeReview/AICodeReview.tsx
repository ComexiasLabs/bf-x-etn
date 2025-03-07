import React, { useState } from 'react';
import styles from './SideBar.module.scss';
import { Review } from '@components/atoms/Review/Review';
import Markdown from 'react-markdown';
import useAI from 'hooks/useAI';
import { getAICodeReviewPreset } from '@modules/ai/presets';
import { Card, CircularProgress } from '@mui/material';
import { ModelIds } from '@modules/ai/ai';

interface AICodeReviewProps {
  code: string;
}

const AICodeReview = ({ code }: AICodeReviewProps) => {
  const { generateAsStream, isLoading, output } = useAI();
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const handleGenerateClick = async (modelId: ModelIds) => {
    if (!code) return;
    setIsGenerated(true);

    await generateAsStream(getAICodeReviewPreset(modelId, code));
  };

  return (
    <div>
      <Review
        title={'AI Code Review'}
        description={
          "Check your Solidity smart contract for any potential bugs, inefficiencies, or areas that could be optimized. This review aims to enhance the contract's performance, ensure code correctness, and maintain best coding practices."
        }
        buttonText={code ? 'Begin Analysis' : 'No Code To Analyze'}
        hideButton={isGenerated}
        onClick={(modelId: ModelIds) => handleGenerateClick(modelId)}
      />
      {(output || isLoading) && (
        <div className="markdown">
          <Card elevation={1} sx={{ padding: 2, marginTop: 1, borderRadius: '16px' }}>
            <Markdown>{output}</Markdown>
            {isLoading ? <CircularProgress size="1rem" /> : <></>}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AICodeReview;
