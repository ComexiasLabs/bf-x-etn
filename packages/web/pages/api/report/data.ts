// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { queryUserProfiles, queryUserWallets } from '../../../scripts/queryUsers';
import { queryApps } from '../../../scripts/queryApps';

type ResponseData = {
  userProfiles: any;
  userWallets: any;
  apps: any;
};

type ResponseError = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  try {
    if (req.method === 'GET') {
      const userProfiles = await queryUserProfiles();
      const userWallets = await queryUserWallets();
      const apps = await queryApps();

      return res.status(200).json({
        userProfiles,
        userWallets,
        apps,
      });
    } else {
      return res.status(400).json({ message: 'HTTP status not supported.' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'An error has occured on the server.' });
  }
}
