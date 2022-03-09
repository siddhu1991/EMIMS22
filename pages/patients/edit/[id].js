// Next JS
import { useRouter } from 'next/router'
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import PageHeading from '../../../components/PageHeading';
// sections
import PatientNewForm from '../../../sections/patients/PatientNewForm';
// Models
import { getHospitalNames } from '../../../models/hospitals';
import { getWards } from '../../../models/wards';
// ----------------------------------------------------------------------

EditPatient.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EditPatient({ hospitals, wards }) {
  const router = useRouter();
  const { themeStretch } = useSettings();

  return (
    <Page title="Patient: Edit patient">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <PageHeading heading="Edit patient" />
        <PatientNewForm hospitals={hospitals} wards={wards} id={router.query.id}/>
      </Container>
    </Page>
  );
}

export async function getServerSideProps() {
  const { data: hospitals } = await getHospitalNames();
  const { data: wards } = await getWards();

  return {
    props: {
      hospitals: hospitals,
      wards: wards,
    }, // will be passed to the page component as props
  };
}