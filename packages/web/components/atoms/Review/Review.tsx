import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';
import SelectAIModelDialog from '@components/dialogs/SelectAIModelDialog/SelectAIModelDialog';
import { DEFAULT_AI_MODEL_ID, ModelIds } from '@modules/ai/ai';

interface ReviewProps {
  title: string;
  description: string;
  buttonText: string;
  hideButton: boolean;
  onClick?: (modelId: ModelIds) => void;
}

export function Review({ title, description, buttonText, hideButton = false, onClick }: ReviewProps) {
  const [selectedModelId, setSelectedModelId] = React.useState<ModelIds>(DEFAULT_AI_MODEL_ID);
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  const handleOptionsClick = () => {
    setShowOptions(true);
  };

  return (
    <>
      <Card elevation={1} sx={{ display: 'flex', padding: 2, borderRadius: '16px' }}>
        <CardContent sx={{ pr: 2 }}>
          <Box mb={1}>
            <Box
              component="h5"
              sx={{
                display: 'inline-block',
              }}
            >
              {title}
            </Box>
          </Box>
          <Box component="p">{description}</Box>
          <Divider light sx={{ mt: 1, mb: 1 }} />
          {!hideButton && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => handleOptionsClick()}
                sx={{ marginRight: '8px' }}
              >
                <SettingsIcon />
              </Button>
              <Button color="primary" variant="outlined" onClick={() => onClick(selectedModelId)}>
                {buttonText} <ArrowRightIcon />
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {showOptions && (
        <SelectAIModelDialog
          show={showOptions}
          selectedModel={selectedModelId}
          onCancel={() => setShowOptions(false)}
          onSelect={(modelId: ModelIds) => setSelectedModelId(modelId)}
        />
      )}
    </>
  );
}
