import type { Invitation } from "../invitation/types";
import type { Tenant } from "../tenant/types";
import { OnboardingSteps, type OnboardingStep } from "./types";

export const getOnboardingStep = (
  invitations: Invitation[],
  tenants: Tenant[],
): OnboardingStep => {
  if (tenants.length === 0 && invitations.length >= 1) {
    return OnboardingSteps.INVITED_USER;
  }

  if (tenants.length === 0) return OnboardingSteps.NEW_USER;

  if (tenants.length === 1) return OnboardingSteps.SINGLE_TENANT;

  return OnboardingSteps.MULTIPLE_TENANTS;
};
