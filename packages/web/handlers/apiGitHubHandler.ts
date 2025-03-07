import logger from '@core/logger/logger';
import { getGitHubFileContent, getGitHubRepository, GitHubFileContent, GitHubRepository } from '@modules/github/github';

export interface ApiFetchGitHubRepository {
  repositoryUrl: string;
  path?: string;
}

export const apiFetchGitHubRepository = async (params: ApiFetchGitHubRepository): Promise<GitHubRepository> => {
  logger.logInfo('apiFetchGitHubRepository', 'Begin', params);

  try {
    const { repositoryUrl, path } = params;
    if (!repositoryUrl) {
      return null;
    }

    const result = await getGitHubRepository(repositoryUrl, path);

    return result;
  } catch (e) {
    logger.logError('apiFetchGitHubRepository', 'Failed', e);
    throw e;
  }
};

export interface ApiFetchGitHubFileContent {
  repositoryUrl: string;
  path: string;
}

export const apiFetchGitHubFileContent = async (params: ApiFetchGitHubFileContent): Promise<GitHubFileContent> => {
  logger.logInfo('apiFetchGitHubFileContent', 'Begin', params);

  try {
    const { repositoryUrl, path } = params;
    if (!repositoryUrl || !path) {
      return null;
    }

    const result = await getGitHubFileContent(repositoryUrl, path);

    return result;
  } catch (e) {
    logger.logError('apiFetchGitHubFileContent', 'Failed', e);
    throw e;
  }
};
