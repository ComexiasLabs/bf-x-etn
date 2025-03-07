import React from 'react';
import styles from './FileSystem.module.scss';
import TreeView from '@mui/lab/TreeView';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Folder from '@mui/icons-material/Folder';
import Article from '@mui/icons-material/Article';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { GitHubFile } from '@modules/github/github';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

export interface FileSystemProps {
  name?: string;
  items?: FileSystemItem[];
  onObjectClick?: (item: FileSystemItem) => void;
}

export interface FileSystemItem {
  id: string;
  name: string;
  path?: string;
  infoText: string;
  type: FileSystemItemType;
  children?: FileSystemItem[];
}

type FileSystemItemType = 'Bucket' | 'Folder' | 'File';

const FileSystem = ({ name, items, onObjectClick }: FileSystemProps) => {
  type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    bgColorForDarkMode?: string;
    color?: string;
    colorForDarkMode?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
  };

  const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
      color: theme.palette.text.secondary,
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      paddingRight: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
      '&.Mui-expanded': {
        fontWeight: theme.typography.fontWeightRegular,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        color: 'var(--tree-view-color)',
      },
      [`& .${treeItemClasses.label}`]: {
        fontWeight: 'inherit',
        color: 'inherit',
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      [`& .${treeItemClasses.content}`]: {
        paddingLeft: theme.spacing(2),
      },
    },
  }));

  const StyledTreeItem = (props: StyledTreeItemProps) => {
    const theme = useTheme();
    const {
      bgColor,
      color,
      labelIcon: LabelIcon,
      labelInfo,
      labelText,
      colorForDarkMode,
      bgColorForDarkMode,
      ...other
    } = props;

    const styleProps = {
      '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
      '--tree-view-bg-color': theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };

    return (
      <StyledTreeItemRoot
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 0.5,
              pr: 0,
            }}
          >
            <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
              {labelText}
            </Typography>
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          </Box>
        }
        style={styleProps}
        {...other}
      />
    );
  };

  const handleClick = (item: FileSystemItem) => {
    onObjectClick(item);
  };

  const getIcon = (type: FileSystemItemType) => {
    if (type === 'Bucket') return ChromeReaderModeIcon;
    if (type === 'Folder') return Folder;
    if (type === 'File') return Article;
    return null;
  };

  const renderTree = (item: FileSystemItem) => (
    <StyledTreeItem
      key={item.id}
      nodeId={item.id}
      labelText={item.name}
      labelIcon={getIcon(item.type)}
      labelInfo={item.infoText}
      onClick={() => handleClick(item)}
    >
      {item.children?.map((childItem) => renderTree(childItem))}
    </StyledTreeItem>
  );

  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {items && items.map((item) => renderTree(item))}
    </TreeView>
  );
};

export default FileSystem;
