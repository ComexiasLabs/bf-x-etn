import axios from 'axios';
import logger from '@core/logger/logger';
import { GitHubFile, GitHubFileContent, GitHubRepository, convertToGitHubFile } from '@modules/github/github';
import { Template, TemplateDependencies, TemplateInput } from '@core/entities/template';
import { Config } from '@core/config/config';
import path from 'path';

export const fetchGitHubRepository = async (
  repositoryUrl: string,
  path: string = '',
): Promise<GitHubRepository | null> => {
  try {
    logger.logInfo('fetchGitHubRepository', `repositoryUrl: ${repositoryUrl}, path: ${path}`);

    if (!repositoryUrl) {
      return null;
    }

    const response = await axios.post<GitHubRepository>(`/api/github/repository`, { repositoryUrl, path });

    return response.data;
  } catch (e) {
    logger.logError('fetchGitHubRepository', 'Failed', e);
    return null;
  }
};

export const fetchGitHubFileContent = async (repositoryUrl: string, path: string = ''): Promise<GitHubFileContent> => {
  try {
    logger.logInfo('fetchGitHubFileContent', `repositoryUrl: ${repositoryUrl}, path: ${path}`);

    if (!repositoryUrl) {
      return null;
    }

    const response = await axios.post<GitHubFileContent>(`/api/github/file`, { repositoryUrl, path });

    return response.data;
  } catch (e) {
    logger.logError('fetchGitHubFileContent', 'Failed', e);
    return null;
  }
};

export interface BlockFabricMetadataFile {
  type: string;
  creator: string;
  name: string;
  description: string;
  inputs?: {
    key?: string;
    label?: string;
    description?: string;
    dataType?: string;
    defaultValue?: string;
    required?: boolean;
  }[];
  contractFile: string;
  dependencies: string[];
  parsed?: {
    contractFile: GitHubFile;
    dependencies: GitHubFile[];
  };
}

export const fetchBlockFabricMetadataFile = async (
  repositoryUrl: string,
  path: string = '',
): Promise<BlockFabricMetadataFile | null> => {
  try {
    logger.logInfo('fetchBlockFabricMetadataFile', `repositoryUrl: ${repositoryUrl}, path: ${path}`);

    if (!repositoryUrl) {
      return null;
    }

    const response = await fetchGitHubFileContent(repositoryUrl, path);
    if (response.status !== 'Found') {
      return null;
    }

    const folder = path.substring(0, path.lastIndexOf('/') + 1);
    const metadata = JSON.parse(response.content) as BlockFabricMetadataFile;

    metadata.parsed = {
      contractFile: convertToGitHubFile(folder + metadata.contractFile),
      dependencies: metadata.dependencies.map((file) => convertToGitHubFile(folder + file)),
    };

    return metadata;
  } catch (e) {
    logger.logError('fetchBlockFabricMetadataFile', 'Failed', e);
    return null;
  }
};

export const loadTemplateFromMetadata = async (templateId: string, folder: string): Promise<Template> => {
  const metadata = await fetchBlockFabricMetadataFile(
    Config.templatesGithubRepo,
    path.join(folder, 'blockfabric.json'),
  );

  const contract = await fetchGitHubFileContent(Config.templatesGithubRepo, path.join(folder, metadata.contractFile));

  // Fetch dependencies files concurrently
  const dependenciesPromises = metadata.dependencies.map((item) =>
    fetchGitHubFileContent(Config.templatesGithubRepo, path.join(folder, item)),
  );
  const dependenciesFiles = await Promise.all(dependenciesPromises);

  const dependencies: TemplateDependencies[] = dependenciesFiles.map((fileContent, index) => ({
    path: metadata.dependencies[index],
    fileContent: fileContent.content,
  }));

  const inputs: TemplateInput[] = metadata.inputs.map((input) => ({
    key: input.key,
    label: input.label,
    description: input.description,
    dataType: input.dataType,
    defaultValue: input.defaultValue,
    required: input.required,
  }));

  const result: Template = {
    templateId: templateId,
    name: metadata.name,
    description: metadata.description,
    creator: metadata.creator,
    tags: [],
    code: contract.content,
    inputs: inputs,
    dependencies: dependencies,
  };

  return result;
};
