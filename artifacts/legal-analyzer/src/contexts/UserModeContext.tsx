import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserMode = "inmate" | "advocate" | "attorney" | "appellate";

const STORAGE_KEY = "caselight_user_mode";
const DEFAULT_MODE: UserMode = "attorney";

interface UserModeContextValue {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextValue>({
  mode: DEFAULT_MODE,
  setMode: () => {},
});

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "inmate" || stored === "advocate" || stored === "attorney" || stored === "appellate") {
        return stored;
      }
    } catch {
      /* localStorage unavailable */
    }
    return DEFAULT_MODE;
  });

  const setMode = (next: UserMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "inmate" || stored === "advocate" || stored === "attorney" || stored === "appellate") {
        setModeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <UserModeContext.Provider value={{ mode, setMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  return useContext(UserModeContext);
}
