import { Config } from '@core/config/config';
import logger from '@core/logger/logger';
import axios from 'axios';

export interface GitHubRepository {
  status: 'Found' | 'NotFound';
  name: string;
  files: GitHubFile[];
  owner: string;
  url: string;
}

export interface GitHubFile {
  id: string;
  name: string;
  path: string;
  fileExtension: string;
  type: 'Folder' | 'File';
}

export const getGitHubRepository = async (repositoryUrl: string, path: string = ''): Promise<GitHubRepository> => {
  const repoInfo = parseGitHubUrl(repositoryUrl);
  if (!repoInfo) {
    return { status: 'NotFound', name: '', files: [], owner: '', url: '' };
  }

  try {
    const files = await fetchFiles(repoInfo.owner, repoInfo.repo, path);
    return {
      status: 'Found',
      name: repoInfo.repo,
      files: files,
      owner: repoInfo.owner,
      url: repositoryUrl,
    };
  } catch (error) {
    console.error('Error:', error);
    return { status: 'NotFound', name: '', files: [], owner: '', url: '' };
  }
};

const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

const fetchFiles = async (owner: string, repo: string, path: string = ''): Promise<GitHubFile[]> => {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `token ${Config.githubApiKey}`,
    },
  });
  const data = response.data;

  return data.map((item: any) => ({
    id: item.sha,
    name: item.name,
    path: item.path,
    fileExtension: item.type === 'file' ? item.name.split('.').pop() : '',
    type: item.type === 'dir' ? 'Folder' : 'File',
  }));
};

export interface GitHubFileContent {
  status: 'Found' | 'NotFound';
  path: string;
  content: string;
}

export const getGitHubFileContent = async (repositoryUrl: string, path: string = ''): Promise<GitHubFileContent> => {
  try {
    const repoInfo = parseGitHubUrl(repositoryUrl);
    if (!repoInfo) {
      return null;
    }

    const content = await fetchFileContent(repoInfo.owner, repoInfo.repo, path);
    return {
      status: 'Found',
      path,
      content,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 'NotFound',
      path,
      content: null,
    };
  }
};

const fetchFileContent = async (owner: string, repo: string, filePath: string): Promise<string> => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `token ${Config.githubApiKey}`,
      },
    });

    // The content of the file is Base64 encoded, so we need to decode it
    const contentBase64 = response.data.content;
    const contentDecoded = Buffer.from(contentBase64, 'base64').toString('utf-8');

    return contentDecoded;
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
};

export const convertToGitHubFile = (filePath: string): GitHubFile => {
  // Extracting file extension
  const fileExtension = filePath.includes('.') ? filePath.substring(filePath.lastIndexOf('.') + 1) : '';

  // Extracting file name
  const segments = filePath.split('/');
  let name = segments[segments.length - 1]; // Default to the last segment
  if (fileExtension) {
    name = name.substring(0, name.lastIndexOf('.'));
  } else {
    // If there's no file extension, it might be a folder
    name = segments[segments.length - 1] || segments[segments.length - 2]; // Handling trailing '/'
  }

  // Determining the type
  const type = filePath.endsWith('/') ? 'Folder' : 'File';

  return {
    id: filePath.replaceAll('/', '').replaceAll('.', ''),
    name: name,
    path: filePath,
    fileExtension: fileExtension,
    type: type,
  };
};
