import { useState, useEffect } from 'react';
import { GitHubFile } from '@modules/github/github';
import { fetchGitHubRepository } from '@services/web/gitHubService';

const useGithubRepository = (repositoryUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const [filesInSelectedFolder, setFilesInSelectedFolder] = useState<GitHubFile[]>([]);
  const [selectedObject, setSelectedObject] = useState<GitHubFile[]>([]);

  const loadFiles = async () => {
    console.log(`useGithub.loadFiles`);

    setIsLoading(true);
    setHasError(false);

    const result = await fetchGitHubRepository(repositoryUrl, selectedFolder ?? '');
    setIsLoading(false);

    console.log(`Fetched result ${JSON.stringify(result)}`);
    if (result === null || result.status !== 'Found') {
      setFilesInSelectedFolder([]);
      setHasError(true);
      return;
    }

    setFilesInSelectedFolder(result.files);
  };

  useEffect(() => {
    loadFiles();
  }, [repositoryUrl, selectedFolder]);

  return {
    isLoading,
    selectedFolder,
    filesInSelectedFolder,
    selectedObject,
    setHasError,
    setSelectedFolder,
    setSelectedObject,
  };
};

export default useGithubRepository;
