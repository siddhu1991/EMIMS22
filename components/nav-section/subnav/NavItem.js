import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
// @mui
import { Box, Link, ListItemText } from '@mui/material';
//
import Iconify from '../../Iconify';
import { ListItemStyle, ListItemTextStyle, ListItemIconStyle } from './style';
import { isExternalLink } from '..';
import { hasMenuAccess } from '../../../utils/checkPermissions';
// ----------------------------------------------------------------------

NavItemRoot.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
    permission: PropTypes.string,
  }),
};

export function NavItemRoot({ item, open = false, active, onOpen }) {
  const { title, path, icon, info, children, permission } = item;

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle disableTypography primary={title} isCollapse="true" />
      <>
        {info && info}
        {children && <ArrowIcon open={open} />}
      </>
    </>
  );

  if (children) {
    // Children Menu Links
    if (hasMenuAccess(permission)) {
      return (
        <ListItemStyle onClick={onOpen} activeRoot={active}>
          {renderContent}
        </ListItemStyle>
      );
    } else {
      return <></>;
    }
  }

  if (isExternalLink(path)) {
    return (
      <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
        {renderContent}
      </ListItemStyle>
    );
  } else {
    // 1st level without children
    if (hasMenuAccess(permission)) {
      return (
        <NextLink href={path}>
          <ListItemStyle activeRoot={active}> {renderContent}</ListItemStyle>
        </NextLink>
      );
    } else {
      return <></>;
    }
  }
}

// ----------------------------------------------------------------------

NavItemSub.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};

export function NavItemSub({ item, open = false, active = false, onOpen }) {
  const { title, path, info, children, permission } = item;

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={title} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeSub={active} subItem>
        {renderContent}
      </ListItemStyle>
    );
  }

  if (isExternalLink(path)) {
    return (
      <ListItemStyle component={Link} href={path} target="_blank" rel="noopener" subItem>
        {renderContent}
      </ListItemStyle>
    );
  } else {
    if (hasMenuAccess(permission)) {
      return (
        <NextLink href={path}>
          <ListItemStyle activeSub={active} subItem>
            {renderContent}
          </ListItemStyle>
        </NextLink>
      );
    } else {
      return <></>;
    }
  }
}

// ----------------------------------------------------------------------

DotIcon.propTypes = {
  active: PropTypes.bool,
};

export function DotIcon({ active }) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main',
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

// ----------------------------------------------------------------------

ArrowIcon.propTypes = {
  open: PropTypes.bool,
};

export function ArrowIcon({ open }) {
  return (
    <Iconify
      icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
      sx={{ width: 16, height: 16, ml: 1 }}
    />
  );
}
