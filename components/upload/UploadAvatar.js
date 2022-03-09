import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { useDropzone } from 'react-dropzone';
// @mui
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
//
import Image from '../Image';
import Iconify from '../Iconify';
import RejectionFiles from './RejectionFiles';
import { createTwoLetterAvatar } from '../../utils/createAvatar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: '100%',
  height: 88,
  border: `2px dashed ${theme.palette.grey[500_32]}`,
  borderRadius: '8px',
}));

const PreviewStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.lighter,
  border: `1px solid ${theme.palette.grey[500_32]}`,
  height: 88,
  width: 88,
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '30px',
  fontWeight: 300,
  color: theme.palette.grey[600],
}));

const DropZoneStyle = styled('div')({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRadius: '8px',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

UploadAvatar.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function UploadAvatar({ error, file, imageName, helperText, sx, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={1}>
          <PreviewStyle>
            {file ? (
              <Image
                alt="avatar"
                src={isString(file) ? file : file.preview}
                sx={{ zIndex: 8, height: '86px', borderRadius: '8px' }}
              />
            ) : (
              <Box>{imageName && createTwoLetterAvatar(imageName).name}</Box>
            )}
          </PreviewStyle>
        </Grid>
        <Grid item xs={12} md={11}>
          <RootStyle
            sx={{
              ...((isDragReject || error) && {
                borderColor: 'error.light',
              }),
              ...sx,
            }}
          >
            <DropZoneStyle
              {...getRootProps()}
              sx={{
                ...(isDragActive && { opacity: 0.72 }),
              }}
            >
              <input {...getInputProps()} />

              <PlaceholderStyle
                className="placeholder"
                sx={{
                  ...((isDragReject || error) && {
                    bgcolor: 'error.lighter',
                  }),
                }}
              >
                <Iconify icon={'heroicons-outline:photograph'} sx={{ width: 26, height: 26, mb: 1 }} />
                <Typography variant="caption">{file ? 'Drop Image to upload' : 'Drop Image to upload'}</Typography>
              </PlaceholderStyle>
            </DropZoneStyle>
          </RootStyle>
          {helperText && helperText}
        </Grid>
      </Grid>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
    </>
  );
}
