// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
import useAuth from '../../hooks/useAuth';
// guards
import GuestGuard from '../../guards/GuestGuard';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const bgImg = ['/images/login/login_2.png', '/images/login/login_1.png'];
const randomBg = Math.floor(Math.random() * bgImg.length);
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
  },
}));

const SectionStyle = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '33.33%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundImage: 'url(' + bgImg[randomBg] + ')',
  backgroundSize: 'cover',
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  maxWidth: 900,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  padding: 0,
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push(PATH_DASHBOARD.root);
  }
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <GuestGuard>
      <Page title="Login" sx={{ height: '100%' }}>
        <RootStyle>
          <Container maxWidth="lg" sx={{ p: 20 }}>
            <ContentStyle>
              {mdUp && <SectionStyle></SectionStyle>}
              <Stack direction="column" sx={{ flexGrow: 1, mb: 5, p: 7 }}>
                <HeaderStyle>
                  <Logo />
                </HeaderStyle>

                <Box>
                  <Typography variant="h4" sx={{ marginBottom: 3 }}>
                    Sign in
                  </Typography>
                </Box>
                <LoginForm />
              </Stack>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
