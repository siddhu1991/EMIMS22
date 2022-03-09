import { useRouter } from 'next/router'
// @mui
import { styled } from '@mui/material/styles';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
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

Index.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter()
  router.push(PATH_DASHBOARD.root);
  return (
    <Page title="Dashboard">
      <RootStyle>
        <ContentStyle>Redirecting to dashboard
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
