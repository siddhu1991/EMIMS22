// @mui
import { styled } from '@mui/material/styles';
import { Container, Card } from '@mui/material';
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

Inbox.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Inbox() {
  return (
    <Page title="Inbox">
      <Container maxWidth="false">
        <PageHeading heading="Inbox" />
          Coming Soon.
      </Container>
    </Page>
  );
}
