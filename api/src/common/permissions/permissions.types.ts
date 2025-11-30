import { PERMISSIONS } from "./permissions.config";

export interface PermissionMetadata {
  resource: keyof typeof PERMISSIONS;
  action: keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
}
