// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  dashboard: getIcon('icon_grid'),
  incidents: getIcon('icon_clipboard_list'),
  approvals: getIcon('icon_clipboard_check'),
  patients: getIcon('icon_identification'),
  help: getIcon('icon_question_circle'),
  settings: getIcon('icon_cog'),
  inbox: getIcon('icon_inbox'),
};

const navConfig = [
  {
    top: [
      // GENERAL
      // ----------------------------------------------------------------------
      {
        subheader: '',
        items: [
          {
            title: 'Inbox',
            path: PATH_DASHBOARD.inbox.root,
            icon: ICONS.inbox,
            permission: '',
            moreSpace: true,
            info: (
              <Label variant="contained" color="success">
                +32
              </Label>
            ),
          },
          {
            title: 'Dashboard',
            path: PATH_DASHBOARD.root,
            icon: ICONS.dashboard,
            permission: '',
          },
          // GENERAL : INCIDENTS
          {
            title: 'incidents',
            path: PATH_DASHBOARD.incidents.root,
            icon: ICONS.incidents,
            permission: 'view_incidents',
            children: [
              { title: 'NG Feeding', path: PATH_DASHBOARD.incidents.ng_feeding, permission: 'view_incidents' },
              { title: 'Feeding Incidents', path: PATH_DASHBOARD.incidents.feeding, permission: 'view_incidents' },
              { title: 'General Incidents', path: PATH_DASHBOARD.incidents.general, permission: 'view_incidents' },
              { title: 'Staff Incidents', path: PATH_DASHBOARD.incidents.staff, permission: 'view_incidents' },
              { title: 'Drafts', path: PATH_DASHBOARD.incidents.draft, permission: 'view_incidents' },
            ],
          },
          // GENERAL : APPROVALS
          {
            title: 'Approvals',
            path: PATH_DASHBOARD.approvals.root,
            icon: ICONS.approvals,
            permission: 'view_approvals',
            children: [
              { title: 'All Approvals', path: PATH_DASHBOARD.approvals.root, permission: 'view_approvals' },
              { title: 'Pending Review', path: PATH_DASHBOARD.approvals.pending_review, permission: 'view_approvals' },
              { title: 'Your Pending', path: PATH_DASHBOARD.approvals.your_pending, permission: 'view_approvals' },
              { title: 'Flagged', path: PATH_DASHBOARD.approvals.flagged, permission: 'view_approvals' },
              { title: 'Approved', path: PATH_DASHBOARD.approvals.approved, permission: 'view_approvals' },
            ],
          },
          // GENERAL : PATIENTS
          {
            title: 'Patients',
            path: PATH_DASHBOARD.patients.root,
            icon: ICONS.patients,
            permission: 'view_patients',
            children: [
              { title: 'All Patients', path: PATH_DASHBOARD.patients.all, permission: 'view_patients' },
              { title: 'Prone Patients', path: PATH_DASHBOARD.patients.prone, permission: 'view_patients' },
              { title: 'New Patient', path: PATH_DASHBOARD.patients.new, permission: 'view_patients' },
            ],
          },
        ],
      },
    ],
    footer: [
      {
        subheader: '',
        items: [
          {
            title: 'Help',
            path: PATH_DASHBOARD.help.root,
            icon: ICONS.help,
            permission: 'view_help',
          },
          {
            title: 'Settings',
            path: PATH_DASHBOARD.settings.users,
            icon: ICONS.settings,
            permission: 'view_settings',
          },
        ],
      },
    ],
    settings: [
      {
        subheader: 'Settings',
        items: [
          {
            title: 'Users',
            path: PATH_DASHBOARD.settings.users,
            permission: 'view_users',
          },
          {
            title: 'Hospitals',
            path: PATH_DASHBOARD.settings.hospitals,
            permission: 'view_settings',
          },
          {
            title: 'Wards',
            path: PATH_DASHBOARD.settings.wards,
            permission: 'view_settings',
          },
          {
            title: 'Locations',
            path: PATH_DASHBOARD.settings.locations,
            permission: 'view_settings',
          },
          {
            title: 'Types',
            path: PATH_DASHBOARD.settings.types,
            permission: 'view_settings',
          },
          {
            title: 'Sections',
            path: PATH_DASHBOARD.settings.sections,
            permission: 'view_settings',
          },
          {
            title: 'Severity',
            path: PATH_DASHBOARD.settings.severity,
            permission: 'view_settings',
          },
          {
            title: 'Clinical Effectiveness',
            path: PATH_DASHBOARD.settings.clinicalEffectiveness,
            permission: 'view_settings',
          },
        ],
      },
    ],
  },
];

export default navConfig;
