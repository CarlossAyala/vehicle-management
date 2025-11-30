import { createContext } from "react";
import type { ThemeState } from "../types";

const initialState: ThemeState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeContext = createContext<ThemeState>(initialState);
