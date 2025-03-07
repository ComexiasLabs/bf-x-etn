import React from 'react';
import styles from './ContentHeader.module.scss';
import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface ContentHeaderProps {
  title: string;
  subtitle: string;
  isMenuOpen: boolean;
  onMenuClick: () => void;
  onNewVersionClick: () => void;
}

const ContentHeader = ({ title, subtitle, isMenuOpen, onMenuClick, onNewVersionClick }: ContentHeaderProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="muiAppBar">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => onMenuClick()}
          >
            {isMenuOpen && <KeyboardArrowLeftIcon />}
            {!isMenuOpen && <KeyboardArrowRightIcon />}
          </IconButton>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            <div className={styles.textWrapper}>
              <span className={styles.name}>{title}</span>
              <span className={styles.description}>{subtitle}</span>
            </div>
          </Typography>
          {subtitle.indexOf('Version') >= 0 && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => onNewVersionClick()}
            >
              <AddCircleIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ContentHeader;
