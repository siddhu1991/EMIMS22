// Next JS
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/SettingsPage';
import PageHeading from '../../../../components/PageHeading';
// sections
import UserNewForm from '../../../../sections/user/UserNewForm';
// Models
import { getHospitalNames } from '../../../../models/hospitals';
import { getWards } from '../../../../models/wards';
import { getUserRoles, getUserById } from '../../../../models/users';
// ----------------------------------------------------------------------

EditUser.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EditUser({ hospitals, wards, roles, currentUser }) {
  const router = useRouter();
  const { themeStretch } = useSettings();

  return (
    <Page title="User: Edit user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <PageHeading heading="Edit user" />
        <UserNewForm hospitals={hospitals} wards={wards} roles={roles} id={router.query.id} currentUser={currentUser} />
      </Container>
    </Page>
  );
}

export async function getServerSideProps({ res, params }) {
  // Redirect to users if Id is undefined - to fix issue after login
  if (typeof params === 'undefined') {
    res.statusCode = 302;
    res.setHeader('location', PATH_DASHBOARD.settings.users);
    return { props: {} };
  }

  const { data: hospitals } = await getHospitalNames();
  const { data: wards } = await getWards();
  const { data: roles } = await getUserRoles();
  const { data: user } = await getUserById(params.id);

  return {
    props: {
      hospitals: hospitals,
      wards: wards,
      roles: roles,
      currentUser: user[0],
    }, // will be passed to the page component as props
  };
}
