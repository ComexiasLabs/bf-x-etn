import React, { useState } from 'react';
import styles from './CreateAppSelection.module.scss';
import ProjectCard from '@components/atoms/ProjectCard/ProjectCard';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import GetAppIcon from '@mui/icons-material/GetApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import { AppCreationModes } from '@modules/firebase';

interface CreateAppSelectionProps {
  onSelect?: (selected: AppCreationModes) => void;
}

export default function CreateAppSelection({ onSelect }: CreateAppSelectionProps) {
  const [selectedContractType, setSelectedContractType] = useState<AppCreationModes>();

  const handleSelect = (selected: AppCreationModes) => {
    setSelectedContractType(selected);
    onSelect && onSelect(selected);
  };

  return (
    <div className={styles.appCreationTypeWrapper}>
      <div className={styles.appCreationTypeItem}>
        <a onClick={() => handleSelect(AppCreationModes.GitHub)}>
          <ProjectCard
            icon={<GitHubIcon />}
            overline={'Import from'}
            heading="GitHub"
            body="Import your Smart Contract from a GitHub repository."
            extra="Learn More"
            selected={selectedContractType === AppCreationModes.GitHub}
          />
        </a>
      </div>
      <div className={styles.appCreationTypeItem}>
        <a onClick={() => handleSelect(AppCreationModes.Template)}>
          <ProjectCard
            icon={<FileCopyIcon />}
            overline={'Create from'}
            heading="Code Templates"
            body="Create your Smart Contract from a collection of pre-defined templates."
            extra="Learn More"
            selected={selectedContractType === AppCreationModes.Template}
          />
        </a>
      </div>
      <div className={styles.appCreationTypeItem}>
        <a onClick={() => handleSelect(AppCreationModes.Import)}>
          <ProjectCard
            icon={<GetAppIcon />}
            overline={'Import from'}
            heading="Existing Contract"
            body="Import an existing Smart Contract which is on testnet or mainnet."
            extra="Learn More"
            selected={selectedContractType === AppCreationModes.Import}
          />
        </a>
      </div>
      <div className={styles.appCreationTypeItem}>
        <a onClick={() => handleSelect(AppCreationModes.Generated)}>
          <ProjectCard
            icon={<GetAppIcon />}
            overline={'Create from'}
            heading="AI Generated"
            body="Experimental. Create your Smart Contract using generative AI."
            extra="Learn More"
            selected={selectedContractType === AppCreationModes.Generated}
          />
        </a>
      </div>
    </div>
  );
}
