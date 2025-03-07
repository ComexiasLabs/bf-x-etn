import React, { useState } from 'react';
import styles from './SideBar.module.scss';
import { Review } from '@components/atoms/Review/Review';
import useAI from 'hooks/useAI';
import { getAISecurityReviewPreset } from '@modules/ai/presets';
import { Card, CircularProgress } from '@mui/material';
import Markdown from 'react-markdown';
import { ModelIds } from '@modules/ai/ai';

interface AISecurityAnalysisProps {
  code: string;
}

const AISecurityAnalysis = ({ code }: AISecurityAnalysisProps) => {
  const { generateAsStream, isLoading, output } = useAI();
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const handleGenerateClick = async (modelId: ModelIds) => {
    if (!code) return;
    setIsGenerated(true);

    await generateAsStream(getAISecurityReviewPreset(modelId, code));
  };

  return (
    <div>
      <Review
        title={'AI Security Analysis'}
        description={
          'Examine your smart contract thoroughly for any security vulnerabilities that could be exploited. This audit focuses on identifying and recommending fixes for security risks, ensuring your contract is fortified against attacks.'
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

export default AISecurityAnalysis;
