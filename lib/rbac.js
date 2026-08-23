export const RBAC = {
  patient: {
    allowedRoutes: ['/patient', '/patient/doctors', '/patient/appointments', '/patient/history'],
    permissions: {
      canBookAppointments: true,
      canViewDoctors: true,
      canViewHistory: true,
      canManageAvailability: false,
      canViewQueue: false,
      canUpdateStatus: false,
    },
  },
  doctor: {
    allowedRoutes: ['/doctor', '/doctor/availability', '/doctor/queue'],
    permissions: {
      canBookAppointments: false,
      canViewDoctors: false,
      canViewHistory: false,
      canManageAvailability: true,
      canViewQueue: true,
      canUpdateStatus: true,
    },
  },
};

export function checkPermission(role, permission) {
  if (!role || !RBAC[role]) return false;
  return RBAC[role].permissions[permission] || false;
}

export function checkRouteAccess(role, path) {
  if (!role || !RBAC[role]) return false;
  return RBAC[role].allowedRoutes.some((route) => path.startsWith(route));
}