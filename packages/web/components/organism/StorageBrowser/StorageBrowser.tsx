import React, { useContext, useEffect, useState } from 'react';
import styles from './StorageBrowser.module.scss';
import FileSystem, { FileSystemItem } from '@components/molecules/FileSystem/FileSystem';
import { Alert, Avatar, Box, Button, Chip, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import VerticalRip from '@components/atoms/Rip/Rip';
import { FileObject, getPublicUrl } from '@modules/greenfield/greenfield';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { handleCopyToClipboard } from '@core/helpers/textHelper';
import useStorageBuckets from 'hooks/useStorageBuckets';
import useStorageObjectsInBucket from 'hooks/useStorageOjectsInBucket';
import { GREENFIELD_TESTNET } from '@modules/greenfield/constants';
import MessageDialogContext from '@components/context/MessageDialogContext';
import localStorageHelper from '@core/storage/localStorageHelper';

export interface StorageBrowserProps {
  walletAddress: string;
  defaultBucketName?: string;
  defaultFolderName?: string;
  showDelete?: boolean;
  selectFolder?: boolean;
  onSelect?: (path: string) => void;
}

const StorageBrowser = ({
  walletAddress,
  defaultBucketName,
  defaultFolderName,
  showDelete = true,
  selectFolder = false,
  onSelect,
}: StorageBrowserProps) => {
  if (localStorageHelper.getStorageWalletAddress()) {
    walletAddress = localStorageHelper.getStorageWalletAddress();
  }

  const { showMessage } = useContext(MessageDialogContext);

  const {
    isLoading: isBucketsLoading,
    buckets,
    bucketsFileSystem,
    selectedBucket,
    setSelectedBucket,
  } = useStorageBuckets(walletAddress, defaultBucketName);

  const {
    isLoading: isObjectsLoading,
    objectsInBucket,
    objectsFileSystem,
    selectedObject,
    setSelectedObject,
  } = useStorageObjectsInBucket(selectedBucket, defaultFolderName);

  const isLoading = isBucketsLoading || isObjectsLoading;

  const providerEndpoint = GREENFIELD_TESTNET.greenfieldStorageProvider;

  const handleObjectClick = async (item: FileSystemItem) => {
    if (item.type === 'Bucket') {
      const bucket = buckets && buckets.find((bucket) => bucket.id === item.id);
      setSelectedBucket(bucket);
    } else {
      const selected: FileObject = objectsInBucket.find((object) => object.id === item.id);
      setSelectedObject(selected);
    }
  };

  const handleUnselectBucket = () => {
    setSelectedBucket(null);
    setSelectedObject(null);
  };

  return (
    <>
      <div>
        <a className={styles.storageProviderButton}>
          <Chip
            avatar={<Avatar alt="bnb" src="/assets/brands/bnb-logo.svg" />}
            label="BNB Greenfield"
            variant="outlined"
            deleteIcon={<DoneIcon />}
            onDelete={() => {}}
          />
        </a>

        <a
          onClick={() => showMessage('Coming Soon', 'IPFS support on BlockFabric is currently in development.')}
          className={styles.storageProviderButton}
        >
          <Chip
            avatar={<Avatar alt="bnb" src="/assets/brands/Ipfs-logo-1024-ice-text.png" />}
            label="IPFS"
            variant="filled"
          />
        </a>

        {selectedBucket && (
          <>
            <ArrowRightIcon />
            {showDelete && (
              <Chip label={selectedBucket.bucketName} variant="outlined" onDelete={handleUnselectBucket} />
            )}
            {!showDelete && <Chip label={selectedBucket.bucketName} variant="outlined" />}
          </>
        )}
      </div>
      {isLoading && (
        <div>
          <Skeleton height={60} />
          <Skeleton height={60} />
          <Skeleton height={60} />
        </div>
      )}
      {!isLoading && (!buckets || !buckets.length) && (
        <Box mt={2}>
          <Alert severity="warning">There are no buckets under this wallet address {walletAddress}.</Alert>
        </Box>
      )}
      {!isLoading && buckets && (
        <div className={styles.frameContainer}>
          <div className={styles.leftFrame}>
            {bucketsFileSystem && !objectsFileSystem && (
              <FileSystem items={bucketsFileSystem} onObjectClick={(item) => handleObjectClick(item)} />
            )}
            {objectsFileSystem && objectsFileSystem.length > 0 && (
              <FileSystem items={objectsFileSystem} onObjectClick={(item) => handleObjectClick(item)} />
            )}
            {objectsFileSystem && objectsFileSystem.length === 0 && (
              <Alert severity="warning">There are no files in this folder.</Alert>
            )}
          </div>
          <VerticalRip />
          <div className={styles.rightFrame}>
            <span className={styles.fileInfoHeading}>Object Information</span>
            {(!selectedBucket || !selectedObject) && <p>Select an object on the left</p>}
            {selectedBucket && selectedObject && (
              <div style={{ marginTop: 8 }}>
                <div>
                  <strong>Name</strong>
                  <p>
                    <small>{selectedObject.objectName}</small>
                  </p>
                </div>
                <div>
                  <strong>Object Type</strong>
                  <p>
                    <small>{selectedObject.objectType}</small>
                  </p>
                </div>
                <div>
                  <strong>Content Type</strong>
                  <p>
                    <small>{selectedObject.contentType}</small>
                  </p>
                </div>
                <div>
                  <strong>Link</strong>
                  <p>
                    <small>
                      <a href={getPublicUrl(providerEndpoint, selectedBucket.bucketName, selectedObject.objectName)}>
                        {getPublicUrl(providerEndpoint, selectedBucket.bucketName, selectedObject.objectName)}
                      </a>
                    </small>
                    <Tooltip title="Copy to Clipboard">
                      <IconButton
                        onClick={() =>
                          handleCopyToClipboard(
                            getPublicUrl(providerEndpoint, selectedBucket.bucketName, selectedObject.objectName),
                          )
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </p>
                </div>
                {selectFolder && selectedObject.objectType === 'Folder' && (
                  <div>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() =>
                        onSelect(getPublicUrl(providerEndpoint, selectedBucket.bucketName, selectedObject.objectName))
                      }
                    >
                      Select
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StorageBrowser;
