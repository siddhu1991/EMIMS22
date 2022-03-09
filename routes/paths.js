// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: path(ROOTS_DASHBOARD, '/dashboard'),
  inbox: {
    root: path(ROOTS_DASHBOARD, '/inbox'),
  },
  incidents: {
    root: path(ROOTS_DASHBOARD, '/incidents'),
    ng_feeding: path(ROOTS_DASHBOARD, '/incidents/ng-feeding'),
    feeding: path(ROOTS_DASHBOARD, '/incidents/feeding'),
    general: path(ROOTS_DASHBOARD, '/incidents/general'),
    staff: path(ROOTS_DASHBOARD, '/incidents/staff'),
    draft: path(ROOTS_DASHBOARD, '/incidents/draft'),
    new: path(ROOTS_DASHBOARD, '/incidents/new'),
  },
  approvals: {
    root: path(ROOTS_DASHBOARD, '/approvals'),
    pending_review: path(ROOTS_DASHBOARD, '/approvals/pending-review'),
    your_pending: path(ROOTS_DASHBOARD, '/approvals/your-pending'),
    flagged: path(ROOTS_DASHBOARD, '/approvals/flagged'),
    approved: path(ROOTS_DASHBOARD, '/approvals/approved'),
  },
  patients: {
    root: path(ROOTS_DASHBOARD, '/patients'),
    all: path(ROOTS_DASHBOARD, '/patients/all'),
    prone: path(ROOTS_DASHBOARD, '/patients/prone'),
    newPatients: path(ROOTS_DASHBOARD, '/patients/new-patients'),
    new: path(ROOTS_DASHBOARD, '/patients/new'),
    edit: path(ROOTS_DASHBOARD, '/patients/edit'),
  },
  help: {
    root: path(ROOTS_DASHBOARD, '/help'),
  },
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings'),
    hospitals: path(ROOTS_DASHBOARD, '/settings/hospitals'),
    wards: path(ROOTS_DASHBOARD, '/settings/wards'),
    users: path(ROOTS_DASHBOARD, '/settings/users'),
    newUser: path(ROOTS_DASHBOARD, '/settings/users/new'),
    editUser: path(ROOTS_DASHBOARD, '/settings/users/edit'),
    locations: path(ROOTS_DASHBOARD, '/settings/locations'),
    types: path(ROOTS_DASHBOARD, '/settings/types'),
    sections: path(ROOTS_DASHBOARD, '/settings/sections'),
    severity: path(ROOTS_DASHBOARD, '/settings/severity'),
    clinicalEffectiveness: path(ROOTS_DASHBOARD, '/settings/clinical-effectiveness'),
  },
};
