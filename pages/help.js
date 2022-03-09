// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
import PageHeading from '../components/PageHeading';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

Help.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Help() {
  return (
    <Page title="Help">
      <Container maxWidth="false">
        <PageHeading heading="Help" />
        Coming Soon..
      </Container>
    </Page>
  );
}
