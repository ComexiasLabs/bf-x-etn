// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { verifyToken } from '@modules/jwt/jwtHelper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiRefreshAnalyticsResponse, apiRefreshAnalytics } from '@handlers/apiAnalyticsHandler';
import { Environments } from '@core/enums/environments';
import { Blockchains } from '@core/enums/blockchains';

export type RequestData = {
  appId: string;
  blockchain: Blockchains;
  contractAddress: string;
  environment: Environments;
};

type ResponseData = ApiRefreshAnalyticsResponse;

type ResponseError = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  try {
    if (req.method === 'POST') {
      const { appId, blockchain, contractAddress, environment }: RequestData = req.body;

      const user = verifyToken(req.headers.authorization);
      if (!user?.userId) {
        return res.status(403).json({ message: 'Unauthorized.' });
      }

      apiRefreshAnalytics({
        appId,
        blockchain,
        contractAddress,
        environment,
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
