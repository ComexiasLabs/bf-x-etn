// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AnalyticsData, AnalyticsTransaction, App } from '@modules/firebase';
import { verifyToken } from '@modules/jwt/jwtHelper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Environments } from '@core/enums/environments';
import { Blockchains } from '@core/enums/blockchains';
import { apiFetchAnalyticsTransactions } from '@handlers/apiAnalyticsHandler';

export type RequestData = {
  appId: string;
  blockchain: Blockchains;
  contractAddress: string;
  environment: Environments;
  startTimestamp: string;
  endTimestamp: string;
};

type ResponseData = AnalyticsTransaction[];

type ResponseError = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  try {
    if (req.method === 'GET') {
      const { appId, blockchain, contractAddress, environment, startTimestamp, endTimestamp }: RequestData =
        req.query as unknown as RequestData;

      const user = verifyToken(req.headers.authorization);
      if (!user?.userId) {
        return res.status(403).json({ message: 'Unauthorized.' });
      }

      apiFetchAnalyticsTransactions({
        appId,
        blockchain,
        contractAddress,
        environment,
        startTimestamp: Number(startTimestamp),
        endTimestamp: Number(endTimestamp),
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
