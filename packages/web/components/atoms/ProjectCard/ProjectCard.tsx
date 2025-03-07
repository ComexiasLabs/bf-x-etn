import React from 'react';
import cx from 'clsx';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import BrandCardHeader from '@mui-treasury/components/cardHeader/brand';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useN03TextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/n03';
import { useLightTopShadowStyles } from '@mui-treasury/styles/shadow/lightTop';
import { styled } from '@mui/system';
import { Avatar } from '@mui/material';

const CardRoot = styled(Card)({
  maxWidth: 343,
  borderRadius: 20,
});

const CardContentStyled = styled(CardContent)({
  padding: 24,
});

interface ProjectCardProps {
  icon?: React.ReactElement;
  overline?: string;
  heading?: string;
  body?: string;
  extra?: string;
  selected?: boolean;
  disabled?: boolean;
}

export const ProjectCard = React.memo(function ProjectCard({
  icon,
  overline,
  heading,
  body,
  extra,
  selected = false,
  disabled = false,
}: ProjectCardProps) {
  const styles = useN03TextInfoContentStyles();
  const shadowStyles = useLightTopShadowStyles();

  return (
    <CardRoot
      className={cx(shadowStyles.root)}
      style={{ borderBottom: selected ? 'solid 3px black' : '', background: disabled ? '#efefef' : '' }}
    >
      {icon && (
        <div style={{ marginLeft: 24, marginTop: 24 }}>
          <Avatar>{icon}</Avatar>
        </div>
      )}
      <CardContentStyled>
        <TextInfoContent classes={styles} overline={overline} heading={heading} body={body} />
      </CardContentStyled>
    </CardRoot>
  );
});

export default ProjectCard;
