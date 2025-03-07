import React, { useState } from 'react';
import styles from './Step2SelectFiles.module.scss';
import { App } from '@modules/firebase';
import { Box, Button, Typography } from '@mui/material';
import GitHubFileSelectDialog, {
  FileSelectionModes,
} from '@components/dialogs/GitHubFileSelectDialog/GitHubFileSelectDialog';
import { GitHubFile, GitHubRepository } from '@modules/github/github';
import { fetchBlockFabricMetadataFile } from '@services/web/gitHubService';

interface Step2SelectFilesProps {
  app: App;
  repo: GitHubRepository;
  onSelectContractFile?: (file: GitHubFile) => void;
  onSelectDependentFiles?: (files: GitHubFile[]) => void;
}

export default function Step2SelectFiles({
  app,
  repo,
  onSelectContractFile,
  onSelectDependentFiles,
}: Step2SelectFilesProps) {
  const [showFileExplorer, setShowFileExplorer] = useState<boolean>(false);
  const [mode, setMode] = useState<FileSelectionModes>();
  const [metadataFile, setMetadataFile] = useState<GitHubFile>(undefined);
  const [smartContractFile, setSmartContractFile] = useState<GitHubFile>(undefined);
  const [dependencyFiles, setDependencyFiles] = useState<GitHubFile[]>([]);

  const handleSelectMetadataFileButtonClick = () => {
    setShowFileExplorer(true);
    setMode('MetadataFile');
  };

  const handleSelectFileButtonClick = () => {
    setShowFileExplorer(true);
    setMode('SelectContractFile');
  };

  const handleAddFileButtonClick = () => {
    setShowFileExplorer(true);
    setMode('SelectDependentFile');
  };

  const handleFileSelect = async (mode: FileSelectionModes, values: GitHubFile[]) => {
    if (mode === 'MetadataFile') {
      const selectedFile = values?.[0];
      if (selectedFile) {
        const metadata = await fetchBlockFabricMetadataFile(repo.url, selectedFile.path);
        if (!metadata) {
          return;
        }
        setSmartContractFile(metadata.parsed.contractFile);
        onSelectContractFile(metadata.parsed.contractFile);

        setDependencyFiles(metadata.parsed.dependencies);
        onSelectDependentFiles(metadata.parsed.dependencies);
      }
    }

    if (mode === 'SelectContractFile') {
      const selectedFile = values?.[0];
      setSmartContractFile(selectedFile);
      onSelectContractFile(selectedFile);
    }

    if (mode === 'SelectDependentFile') {
      setDependencyFiles(values);
      onSelectDependentFiles(values);
    }
    setShowFileExplorer(false);
  };

  return (
    <div>
      <h4>Smart Contract File</h4>

      <Box sx={{ margin: 2 }}>
        <Typography variant="caption">Load files from configuration</Typography>
      </Box>

      <Box sx={{ border: 'solid 1px silver', padding: 2, margin: 2, borderRadius: 2 }}>
        <Typography variant="body1">Select the blockfabric.json metadata file if you have it.</Typography>
        {smartContractFile && (
          <div>
            <ul>
              <li>{smartContractFile.path}</li>
            </ul>
          </div>
        )}
        <Button color="secondary" variant="outlined" onClick={() => handleSelectMetadataFileButtonClick()}>
          Load from Metadata
        </Button>
      </Box>

      <Box sx={{ margin: 2 }}>
        <Typography variant="caption">Or select files manually</Typography>
      </Box>

      <Box sx={{ border: 'solid 1px silver', padding: 2, margin: 2, borderRadius: 2 }}>
        <Typography variant="body1">Select the main .sol file for your Smart Contract.</Typography>
        {smartContractFile && (
          <div>
            <ul>
              <li>{smartContractFile.path}</li>
            </ul>
          </div>
        )}
        <Button color="secondary" variant="outlined" onClick={() => handleSelectFileButtonClick()}>
          Select File
        </Button>

        <div className="mt-4">
          <h4>Dependencies</h4>
          <Typography variant="body1">Add the files that your Smart Contract is dependent on.</Typography>
          {smartContractFile && (
            <div>
              <ul>
                {dependencyFiles.map((item) => (
                  <li key={item.id}>{item.path}</li>
                ))}
              </ul>
            </div>
          )}
          <Button color="secondary" variant="outlined" onClick={() => handleAddFileButtonClick()}>
            Select File(s)
          </Button>
        </div>
      </Box>

      {showFileExplorer && (
        <GitHubFileSelectDialog
          show={true}
          mode={mode}
          repo={repo}
          allowMultipleSelect={mode === 'SelectContractFile' ? false : true}
          onCancel={() => setShowFileExplorer(false)}
          onSelect={(mode, values) => handleFileSelect(mode, values)}
        />
      )}
    </div>
  );
}
