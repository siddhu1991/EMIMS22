// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
import PageHeading from '../../components/PageHeading';
// sections
import IncidentNewForm from '../../sections/incidents/IncidentNewForm';
// Models
import { getHospitalNames } from '../../models/hospitals';
import { getWards } from '../../models/wards';
import { getLocations } from '../../models/locations';
// ----------------------------------------------------------------------

IncidentCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function IncidentCreate({ hospitals, wards, locations }) {
  const { themeStretch } = useSettings();

  return (
    <Page title="Incident: Create a new incident">
      <Container className="incidents-add-edit" maxWidth={themeStretch ? false : 'lg'}>
        <PageHeading heading="New Incident adsnjsandj" />
        <IncidentNewForm hospitals={hospitals} wards={wards} locations={locations} />
      </Container>
    </Page>
  );
}

export async function getServerSideProps() {
  const { data: hospitals } = await getHospitalNames();
  const { data: wards } = await getWards();
  const { data: locations } = await getLocations();

  return {
    props: {
      hospitals: hospitals,
      wards: wards,
      locations: locations
    }, // will be passed to the page component as props
  };
}