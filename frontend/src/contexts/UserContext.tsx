import { createContext, useContext, useState } from "react";
import type { EmployeeExternal } from "../types/externalTypes";

interface UserContextType {
    user: EmployeeExternal | null;
    setUser: (user: EmployeeExternal | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    token: null,
    setToken: () => {}
});

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<EmployeeExternal | null>(null);
    const [token, setToken] = useState<string | null>(null);
    return (
        <UserContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
  return useContext(UserContext);
}