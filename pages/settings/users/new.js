// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import SettingsPage from '../../../components/SettingsPage';
import PageHeading from '../../../components/PageHeading';
// sections
import UserNewForm from '../../../sections/user/UserNewForm';
// Models
import { getHospitalNames } from '../../../models/hospitals';
import { getWards } from '../../../models/wards';
import { getUserRoles } from '../../../models/users';
// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserCreate({ hospitals, wards, roles }) {
  const { themeStretch } = useSettings();

  return (
    <SettingsPage title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <PageHeading heading="New User" />
        <UserNewForm hospitals={hospitals} wards={wards} roles={roles} />
      </Container>
    </SettingsPage>
  );
}

export async function getServerSideProps() {
  const { data: hospitals } = await getHospitalNames();
  const { data: wards } = await getWards();
  const { data: roles } = await getUserRoles();

  return {
    props: {
      hospitals: hospitals,
      wards: wards,
      roles: roles,
    }, // will be passed to the page component as props
  };
}
