import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

CollapseButton.propTypes = {
  collapseClick: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
};

export default function CollapseButton({ onToggleCollapse, collapseClick }) {
  return (
    <IconButtonAnimate onClick={onToggleCollapse}>
      <Box
        sx={{
          lineHeight: 0,
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseClick && {
            transform: 'rotate(180deg)',
          }),
        }}
      >
        {icon}
      </Box>
    </IconButtonAnimate>
  );
}

// ----------------------------------------------------------------------

const icon = (
  <img src="/images/collapse-button.svg" alt="collapse-button" />
);
