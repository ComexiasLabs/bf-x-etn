// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiFetchGitHubRepository } from '@handlers/apiGitHubHandler';
import { GitHubRepository } from '@modules/github/github';

type RequestData = {
  repositoryUrl: string;
  path?: string;
};

type ResponseData = GitHubRepository;

type ResponseError = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  try {
    if (req.method === 'POST') {
      const { repositoryUrl, path = '' }: RequestData = req.body;

      apiFetchGitHubRepository({
        repositoryUrl: repositoryUrl as string,
        path: path as string,
      }).then((result) => {
        return res.status(200).json(result);
      });
    } else {
      return res.status(400).json({ message: 'HTTP status not supported.' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'An error has occured on the server.' });
  }
}
