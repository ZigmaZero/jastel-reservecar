import { createContext, useContext, useState } from "react";
import type { AdminExternal } from "../types/externalTypes";

interface AdminContextType {
    admin: AdminExternal | null;
    setAdmin: (admin: AdminExternal | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
}

const AdminContext = createContext<AdminContextType>({
    admin: null,
    setAdmin: () => {},
    token: null,
    setToken: () => {}
});

export const AdminProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [admin, setAdmin] = useState<AdminExternal | null>(null);
    const [token, setToken] = useState<string | null>(null);
    return (
        <AdminContext.Provider value={{ admin, setAdmin, token, setToken }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdmin() {
  return useContext(AdminContext);
}