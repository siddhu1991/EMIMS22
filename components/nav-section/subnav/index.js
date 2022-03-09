import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontSize: '1.5rem',
    fontWeight: '500',
    textTransform: 'normal',
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

SubNav.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function SubNav({ navConfig, ...other }) {
  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 0 }}>
          <ListSubheaderStyle>
            {group.subheader}
          </ListSubheaderStyle>

          {group.items.map((list) => (
            <NavListRoot key={list.title} list={list} isCollapse="false" />
          ))}
        </List>
      ))}
    </Box>
  );
}