import { useState, useEffect } from 'react';
import { Bucket, getBuckets } from '@modules/greenfield/greenfield';
import { FileSystemItem } from '@components/molecules/FileSystem/FileSystem';

const useStorageBuckets = (walletAddress: string, defaultBucketName?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [bucketsFileSystem, setBucketsFileSystem] = useState<FileSystemItem[]>();
  const [selectedBucket, setSelectedBucket] = useState<Bucket>();
  const [hasError, setHasError] = useState(false);

  const loadBuckets = async () => {
    setIsLoading(true);
    setHasError(false);

    setBucketsFileSystem(null);

    const buckets = await getBuckets(walletAddress);
    if (buckets === null) {
      setHasError(true);
    }

    setBuckets(buckets);

    const fileSystemItems = convertBucketsToFileSystemItems(buckets);
    setBucketsFileSystem(fileSystemItems);

    if (defaultBucketName) {
      const bucket = buckets && buckets.find((bucket) => bucket.bucketName === defaultBucketName);
      if (bucket) {
        setSelectedBucket(bucket);
      }
    }

    setIsLoading(false);
  };

  const convertBucketsToFileSystemItems = (buckets: Bucket[]): FileSystemItem[] => {
    const items: FileSystemItem[] =
      buckets &&
      buckets.map((item) => ({
        id: item.id,
        name: item.bucketName,
        infoText: '',
        type: 'Bucket',
      }));

    return items;
  };

  useEffect(() => {
    loadBuckets();
  }, [walletAddress, defaultBucketName]);

  return { isLoading, buckets, bucketsFileSystem, selectedBucket, setSelectedBucket, setHasError };
};

export default useStorageBuckets;
