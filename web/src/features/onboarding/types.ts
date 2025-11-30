export const OnboardingSteps = {
  INVITED_USER: "invited-user",
  NEW_USER: "new-user",
  SINGLE_TENANT: "single-tenant",
  MULTIPLE_TENANTS: "multiple-tenants",
} as const;

export type OnboardingStep =
  (typeof OnboardingSteps)[keyof typeof OnboardingSteps];
