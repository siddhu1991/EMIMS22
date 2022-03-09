import PropTypes from 'prop-types';
import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Box, Stack, Drawer } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { NAVBAR } from '../../../config';
// components
import Scrollbar from '../../../components/Scrollbar';
import SubNav from '../../../components/nav-section/subnav';
//
import navConfig from '../../../layouts/dashboard/navbar/NavConfig';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function SubNavbar({ isCollapse }) {
  const theme = useTheme();
  const { pathname, asPath } = useRouter();
  let drawerLeft = NAVBAR.DASHBOARD_WIDTH + 1 +'px';
  const isDesktop = useResponsive('up', 'lg');

  const { collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } = useCollapseDrawer();

  if (isCollapse) {
    drawerLeft = NAVBAR.DASHBOARD_COLLAPSE_WIDTH + 1 +'px';
  }
  const useStyles = makeStyles({
    drawer: {
      left: 0,
      zIndex: 9,
      position: 'relative',
      marginLeft: 'auto',
      '& .MuiBackdrop-root': {
        display: 'none',
      },
      '& .MuiDrawer-paper': {
        width: 200,
        position: 'relative',
        transition: 'none !important',
      },
    },
  });
  const classes = useStyles();

  if (!pathname.includes('settings') && !asPath.includes('settings')) {
    return <></>;
  }
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <SubNav navConfig={navConfig[0].settings} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: NAVBAR.DASHBOARD_WIDTH,
        },
        ...(isCollapse && {
          display: 'none',
        }),
        ...(collapseClick && {
          position: 'relative',
        }),
      }}
    >
      {isDesktop && (
        <Drawer
          open
          variant="permanent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          classes={{
            paper: classes.drawer,
          }}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRight: 'none',
              bgcolor: 'background.subdrawer',
              transition: (theme) =>
                theme.transitions.create('left', {
                  duration: theme.transitions.duration.standard,
                }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
