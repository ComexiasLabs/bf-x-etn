import { GitHubFile } from '@modules/github/github';

export interface GitHubLoadedFile {
  file: GitHubFile;
  content: string;
}
