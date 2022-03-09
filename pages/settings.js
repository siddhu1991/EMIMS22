import { useRouter } from 'next/router'
// components
import Page from '../components/Page';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// ----------------------------------------------------------------------

export default function Settings() {
  const router = useRouter()
  router.push(PATH_DASHBOARD.settings.users);
  return (
    <Page title="Patients"></Page>
  );
}
