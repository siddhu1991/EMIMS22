// Material Components
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Material Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import Iconify from '../../components/Iconify';

export default function IncidentTabs({ currentActiveTabIndex, tabDisabled, tabStatus, handleChange }) {
  var tabIcon = [];
  for (var i = 0; i < tabStatus.length; i++) {
    if (tabStatus[i] == 'pending') {
      tabIcon[i] = <CircleOutlinedIcon />;
    } else if (tabStatus[i] == 'inprogress') {
      tabIcon[i] = <Iconify icon={'zmdi:dot-circle'} fontSize="1.4rem" />;
    } else if (tabStatus[i] == 'complete') {
      tabIcon[i] = <CheckCircleIcon />;
    }
  }

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={currentActiveTabIndex}
      onChange={handleChange}
      aria-label="Incidents Steps"
    >
      <Tab label="Select Incident Category" className={tabStatus[0]} disabled={tabDisabled[0]} icon={tabIcon[0]} />
      <Tab label="Basic Information" className={tabStatus[1]} disabled={tabDisabled[1]} icon={tabIcon[1]} />
      <Tab label="Incident Details" className={tabStatus[2]} disabled={tabDisabled[2]} icon={tabIcon[2]} />
      <Tab label="Submission" className={tabStatus[3]} disabled={tabDisabled[3]} icon={tabIcon[3]} />
    </Tabs>
  );
}
