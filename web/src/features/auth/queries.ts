import { useNavigate } from "@tanstack/react-router";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getProfile, login, logout, register } from "./api";

export const authKeys = {
  key: () => ["auth"] as const,
  profile: () => [...authKeys.key(), "profile"] as const,
};

export const profileQuery = queryOptions({
  queryKey: authKeys.profile(),
  queryFn: getProfile,
  retry: false,
});

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(profileQuery.queryKey, data);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.clear();

      navigate({ to: "/login" });
    },
  });
};
