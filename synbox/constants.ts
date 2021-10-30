import { UserBody, Scope, Role, Languages, RolePermissions, DateFormat, TimeFormat } from '../../common-types';
import { UsersPermissionAction } from '../../types';

export enum INPUT_TYPES {
  // common
  name = 'name',

  // users
  email = 'email',
  password = 'password',
  passwordConfirmation = 'passwordConfirmation',
  language = 'language',
  timezone = 'timezone',
  roleIds = 'roleIds',
  scopeIds = 'scopeIds',
  availableIPsList = 'availableIPsList',
  availableIPsIsActive = 'availableIPsIsActive',

  // roles
  title = 'title',
  description = 'description',

  // scopes
  prefixes = 'prefixes',
}

export const initUser: UserBody = {
  email: '',
  password: '',
  passwordConfirmation: '',
  roleIds: [],
  scopeIds: [],
  timezone: null,
  name: '',
  language: Languages['en-US'],
  available_ips: {
    active: false,
    list: [],
  },
  time_format: TimeFormat['HH:mm'],
  date_format: DateFormat['D/MM/YYYY'],
};
export const initRole: Role = {
  id: 0,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  key: null,
  title: '',
  description: '',
  is_vendorlock: false,
  usersCount: 0,
  config: {},
};

export const initScope: Scope = {
  id: 0,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  name: '',
  prefixes: [''],
};

export const mitigationPermissions = [
  RolePermissions.MITIGATION_LIST,
  RolePermissions.MITIGATION_POST,
  RolePermissions.MITIGATION_GET,
  RolePermissions.MITIGATION_PUT,
  RolePermissions.MITIGATION_DELETE,
];
export const dashboardPermissions = [
  RolePermissions.DASHBOARD_SENSOR,
  RolePermissions.DASHBOARD_COMMON_STATS,
  RolePermissions.DASHBOARD_CONTEXT,
  RolePermissions.DASHBOARD_CONNECTIONS,
  RolePermissions.DASHBOARD_SCRUBBER,
  RolePermissions.DASHBOARD_LOAD,
  RolePermissions.DASHBOARD_TRAFFIC_THROUGHPUT,
  RolePermissions.DASHBOARD_RAM,
  RolePermissions.DASHBOARD_CLUSTER_INFO,
  RolePermissions.DASHBOARD_ATTACK_HISTORY,
];
export const userProfilePermissions = [
  RolePermissions.USER_PROFILE_CHANGE_EMAIL,
  RolePermissions.USER_PROFILE_CHANGE_PASSWORD,
  RolePermissions.USER_PROFILE_CHANGE_PROFILE,
  RolePermissions.USER_PROFILE_RESTORE_PASSWORD,
];
export interface ActionTypes {
  [UsersPermissionAction.DEACTIVATE]: number[];
  [UsersPermissionAction.ACTIVATE]: number[];
}

export const USER_WORD = {
  ru: { root: 'пользовател', ends: ['ь', 'я', 'ей'] },
  en: {
    root: 'user',
    ends: ['', 's', 's'],
  },
};

export const MITIGATION_WORD = {
  ru: { root: 'митигаци', ends: ['я', 'и', 'и'] },
  en: { root: 'mitigation', ends: ['', 's', 's'] },
};

export const ATTACK_WORD = {
  ru: { root: 'атак', ends: ['а', 'и', ''] },
  en: { root: 'attack', ends: ['', 's', 's'] },
};
