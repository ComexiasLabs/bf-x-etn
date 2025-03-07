import React from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import styles from './GitHubFileSelectDialog.module.scss';
import FileSystem, { FileSystemItem } from '@components/molecules/FileSystem/FileSystem';
import useGithubRepository from 'hooks/useGithub';
import { GitHubFile, GitHubRepository } from '@modules/github/github';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

export type FileSelectionModes = 'MetadataFile' | 'SelectContractFile' | 'SelectDependentFile';

interface GitHubFileSelectDialogProps {
  show: boolean;
  mode: 'MetadataFile' | 'SelectContractFile' | 'SelectDependentFile';
  repo: GitHubRepository;
  allowMultipleSelect: boolean;
  onCancel: () => void;
  onSelect: (mode: FileSelectionModes, values: GitHubFile[]) => void;
}

export default function GitHubFileSelectDialog({
  show,
  mode,
  repo,
  allowMultipleSelect = false,
  onCancel,
  onSelect,
}: GitHubFileSelectDialogProps) {
  const {
    isLoading,
    selectedFolder,
    filesInSelectedFolder,
    selectedObject,
    setSelectedObject,
    setHasError,
    setSelectedFolder,
  } = useGithubRepository(repo.url);

  const handleObjectClick = async (item: FileSystemItem) => {
    if (item.type === 'Folder') {
      setSelectedFolder(item.path);
    } else {
      if (allowMultipleSelect) {
        const isAlreadySelected = selectedObject.some((selectedItem) => selectedItem.id === item.id);
        if (!isAlreadySelected) {
          setSelectedObject([
            ...selectedObject,
            {
              id: item.id,
              name: item.name,
              path: item.path,
              fileExtension: '',
              type: item.type === 'File' ? 'File' : 'Folder',
            },
          ]);
        }
      } else {
        setSelectedObject([
          {
            id: item.id,
            name: item.name,
            path: item.path,
            fileExtension: '',
            type: item.type === 'File' ? 'File' : 'Folder',
          },
        ]);
      }
    }
  };

  const mapGitHubToFileSystem = (files: GitHubFile[]): FileSystemItem[] => {
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      infoText: '',
      type: file.type === 'Folder' ? 'Folder' : 'File',
    }));
  };

  const handleConfirm = () => {
    onSelect(mode, selectedObject);
  };

  const handleFolderBack = () => {
    const folders = selectedFolder.split('/');
    if (folders.length > 1) {
      folders.pop();
      const oneFolderBack = folders.join('/');
      setSelectedFolder(oneFolderBack);
    } else {
      setSelectedFolder(undefined);
    }
  };

  return (
    <Modal show={show} size="lg" onHide={onCancel} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <GitHubIcon />
          <span>
            {' '}
            {repo.owner}/{repo.name}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={6} sm={12}>
              <div>
                {selectedFolder && (
                  <IconButton onClick={() => handleFolderBack()}>
                    <ArrowBackIcon /> ../
                  </IconButton>
                )}
              </div>
              <div>
                <FileSystem
                  items={mapGitHubToFileSystem(filesInSelectedFolder)}
                  onObjectClick={(item) => handleObjectClick(item)}
                />
              </div>
            </Col>
            <Col md={6} sm={12}>
              <div>
                <strong>Selected Folder</strong>
                <p>
                  <small>/{selectedFolder}</small>
                </p>
              </div>
              <div>
                <strong>Selected File(s)</strong>
                <p>
                  <small>
                    {selectedObject && selectedObject.length > 0
                      ? selectedObject.map((obj) => obj.name).join(', ')
                      : 'None'}
                  </small>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => handleConfirm()}>
          Select
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
