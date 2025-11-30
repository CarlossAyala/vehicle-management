import { API_URL } from "@/lib/utils";
import type { LoginDto, RegisterDto } from "./types";
import type { User } from "../user/types";

export const register = async (dto: RegisterDto): Promise<Response> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response;
};

export const login = async (dto: LoginDto): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

export const logout = async (): Promise<Response> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response;
};

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  } catch (_) {
    return null;
  }
};
