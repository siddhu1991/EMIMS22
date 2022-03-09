import { useState } from 'react';
// @mui
import { MenuItem, Stack } from '@mui/material';
// hooks
//import useLocales from '../../../hooks/useLocales';
// components
import Image from '../../../components/Image';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const { allLang, currentLang, onChangeLang } = '';

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>

    </>
  );
}
