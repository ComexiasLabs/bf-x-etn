// import { Client } from '@bnb-chain/greenfield-js-sdk';
import logger from '@core/logger/logger';
import { GREENFIELD_TESTNET } from './constants';
import { getCurrentTimestamp } from '@core/helpers/datetimeHelper';

const GRPC_URL = GREENFIELD_TESTNET.greenfieldGRPCUrl;
const GREENFIELD_RPC_URL = GREENFIELD_TESTNET.greenfieldRPCUrl;
const GREEN_CHAIN_ID = GREENFIELD_TESTNET.greenfieldChainId;

// export const client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID));

export const getStorageProviders = async () => {
  try {
    // logger.logInfo('getStorageProviders', 'Begin');
    // const providers = await client.sp.getStorageProviders();
    // const filteredProviders = (providers ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');

    // return filteredProviders;
    return null;
  } catch (e) {
    logger.logError('getStorageProviders', 'Error', e);
  }
};

export const getRandomStorageProvider = async () => {
  logger.logInfo('getRandomStorageProvider', 'Begin');

  const providers = await getStorageProviders();

  const randomIndex = Math.floor(Math.random() * providers.length);

  const secondarySpAddresses = [...providers.slice(0, randomIndex), ...providers.slice(randomIndex + 1)].map(
    (item) => item.operatorAddress,
  );

  const selectedStorageProvider = {
    id: providers[randomIndex].id,
    endpoint: providers[randomIndex].endpoint,
    primarySpAddress: providers[randomIndex]?.operatorAddress,
    sealAddress: providers[randomIndex].sealAddress,
    secondarySpAddresses,
  };

  return selectedStorageProvider;
};

export interface Bucket {
  id: string;
  bucketName: string;
  ownerAddress: string;
  createdTime: number;
  createdTx: string;
}

export const getBuckets = async (address: string, endpoint?: string): Promise<Bucket[]> => {
  try {
    logger.logInfo('getBuckets', 'Begin', { address, endpoint });

    // if (!endpoint) {
    //   endpoint = (await getRandomStorageProvider()).endpoint;
    // }

    // const buckets = await client.bucket.listBuckets({
    //   address,
    //   endpoint,
    // });

    // if (buckets.statusCode !== 200) {
    //   logger.logError('getBuckets', 'Error retrieving from client.bucket.getUserBuckets', buckets.statusCode);
    //   return null;
    // }

    // const activeBuckets = buckets.body.filter((item) => !item.Removed);

    // const result: Bucket[] = activeBuckets.map((item) => ({
    //   id: item.BucketInfo.Id,
    //   bucketName: item.BucketInfo.BucketName,
    //   ownerAddress: item.BucketInfo.Owner,
    //   createdTime: Number(item.BucketInfo.CreateAt),
    //   createdTx: item.CreateTxHash,
    // }));

    // return result;
    return [];
  } catch {
    return null;
  }
};

export interface FileObject {
  id: string;
  bucketName: string;
  objectName: string;
  objectType: 'Folder' | 'File';
  ownerAddress: string;
  creatorAddress: string;
  contentType: string;
  createdTime: number;
  createdTx: string;
}

export const getObjectsInBucket = async (bucketName: string, endpoint?: string): Promise<FileObject[]> => {
  try {
    logger.logInfo('getObjectsInBucket', 'Begin', { bucketName, endpoint });

    // if (!endpoint) {
    //   endpoint = (await getRandomStorageProvider()).endpoint;
    // }

    // logger.logInfo('getObjectsInBucket', 'client.object.listObjects', { bucketName, endpoint });
    // const objects = await client.object.listObjects({
    //   bucketName,
    //   endpoint,
    // });

    // if (objects.statusCode !== 200) {
    //   logger.logError('getObjectsInBucket', 'Error retrieving from client.object.listObjects', objects.statusCode);
    //   return null;
    // }

    // const activeObjects = objects.body.objects.filter((item) => !item.removed);

    // const result: FileObject[] = activeObjects.map((item) => ({
    //   id: item.object_info.id,
    //   bucketName: item.object_info.bucket_name,
    //   objectName: item.object_info.object_name,
    //   objectType:
    //     item.object_info.object_name.endsWith('/') && item.object_info.content_type === 'text/plain'
    //       ? 'Folder'
    //       : 'File',
    //   ownerAddress: item.object_info.owner,
    //   creatorAddress: item.object_info.creator,
    //   contentType: item.object_info.content_type,
    //   createdTime: Number(item.object_info.create_at),
    //   createdTx: item.create_tx_hash,
    // }));

    // return result;
    return [];
  } catch (e) {
    logger.logError('getObjectsInBucket', 'Error', e);
    //return null;

    // TODO: Mock
    const result: FileObject[] = [];
    result.push({
      id: '18402',
      bucketName: 'blockfabric',
      objectName: 'BlockFabric NFT/',
      objectType: 'Folder',
      ownerAddress: '0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22',
      creatorAddress: '0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22',
      contentType: 'text/plain',
      createdTime: getCurrentTimestamp(),
      createdTx: '1',
    });
    result.push({
      id: '18403',
      bucketName: 'blockfabric',
      objectName: 'BlockFabric NFT/1.png',
      objectType: 'File',
      ownerAddress: '0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22',
      creatorAddress: '0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22',
      contentType: 'image/jpeg',
      createdTime: getCurrentTimestamp(),
      createdTx: '1',
    });
    result.push({
      id: '18404',
      bucketName: 'blockfabric',
      objectName: 'BlockFabric NFT/2.png',
      objectType: 'File',
      ownerAddress: '0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22',
      creatorAddress: '0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22',
      contentType: 'image/jpeg',
      createdTime: getCurrentTimestamp(),
      createdTx: '1',
    });

    return result;
  }
};

export const getPublicUrl = (endpoint: string, bucketName: string, objectName: string) => {
  // https://gnfd-testnet-sp4.bnbchain.org/view/blockfabric-testnet/BlockFabricTestNFT/1.jpeg
  return `${endpoint}/view/${bucketName}/${objectName}`;
};
