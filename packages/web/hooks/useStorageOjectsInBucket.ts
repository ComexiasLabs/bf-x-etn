import { useState, useEffect } from 'react';
import { Bucket, FileObject, getObjectsInBucket } from '@modules/greenfield/greenfield';
import { FileSystemItem } from '@components/molecules/FileSystem/FileSystem';

const useStorageObjectsInBucket = (selectedBucket: Bucket, defaultFolderName?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [objectsInBucket, setObjectsInBucket] = useState([]);
  const [objectsFileSystem, setObjectsFileSystem] = useState<FileSystemItem[]>();
  const [selectedObject, setSelectedObject] = useState<FileObject>();
  const [hasError, setHasError] = useState(false);

  const loadObjectsInBucket = async () => {
    setIsLoading(true);
    setHasError(false);

    setSelectedObject(null);
    setObjectsFileSystem([]);

    let objects = await getObjectsInBucket(selectedBucket.bucketName);
    if (objects === null) {
      setHasError(true);
    }

    if (defaultFolderName) {
      objects = objects && objects.filter((object) => object.objectName.startsWith(`${defaultFolderName}/`));
    }
    setObjectsInBucket(objects);

    const fileSystemItems = convertObjectsToFileSystemItems(objects);
    setObjectsFileSystem(fileSystemItems);

    setIsLoading(false);
  };

  const convertObjectsToFileSystemItems = (objects: FileObject[]): FileSystemItem[] => {
    const buildTree = (path: string): FileSystemItem[] => {
      return (
        objects &&
        objects
          .filter((obj) => obj.objectName.startsWith(path) && obj.objectName !== path)
          .reduce<FileSystemItem[]>((acc, item) => {
            const remainingPath = item.objectName.slice(path.length);
            const nextSlashIndex = remainingPath.indexOf('/');
            const isFolder = remainingPath.endsWith('/') && item.contentType === 'text/plain';
            if (nextSlashIndex > -1 || isFolder) {
              const folderName = nextSlashIndex > -1 ? remainingPath.slice(0, nextSlashIndex + 1) : remainingPath;
              if (!acc.find((child) => child.name === folderName)) {
                acc.push({
                  id: item.id,
                  name: folderName,
                  infoText: isFolder
                    ? `${
                        objects.filter(
                          (obj) => obj.objectName.startsWith(path + folderName) && obj.objectName !== path + folderName,
                        ).length
                      } items`
                    : '',
                  type: 'Folder',
                  children: buildTree(path + folderName),
                });
              }
            } else {
              acc.push({
                id: item.id,
                name: remainingPath,
                infoText: '',
                type: 'File',
              });
            }
            return acc;
          }, [])
      );
    };

    return buildTree('');
  };

  useEffect(() => {
    if (selectedBucket) {
      loadObjectsInBucket();
    } else {
      setObjectsInBucket(null);
      setObjectsFileSystem(null);
    }
  }, [selectedBucket]);

  return { isLoading, objectsInBucket, objectsFileSystem, selectedObject, setSelectedObject, setHasError };
};

export default useStorageObjectsInBucket;
