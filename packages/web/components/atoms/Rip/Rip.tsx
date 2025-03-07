import React from 'react';
import Box from '@material-ui/core/Box';
import { useVerticalRipStyles } from '@mui-treasury/styles/rip/vertical';
import VerticalTicketRip from '@mui-treasury/components/rip/verticalTicket';

const VerticalRip = () => {
  const styles = useVerticalRipStyles({
    size: 20,
    rightColor: '#f0f0f0',
    tearColor: '#201626',
  });
  return (
    <Box display={'flex'} position={'relative'}>
      <VerticalTicketRip classes={styles} />
    </Box>
  );
};

VerticalRip.propTypes = {};
VerticalRip.defaultProps = {};

export default VerticalRip;
