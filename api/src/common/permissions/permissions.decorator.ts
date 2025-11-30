import { SetMetadata } from "@nestjs/common";
import { PERMISSIONS } from "./permissions.config";
import { PERMISSION_KEY } from "./permissions.constant";

export const Permissions = (
  resource: keyof typeof PERMISSIONS,
  action: keyof (typeof PERMISSIONS)[typeof resource],
) => {
  return SetMetadata(PERMISSION_KEY, { resource, action });
};
