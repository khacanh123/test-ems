import { RoleType } from 'enum';
import { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Context = createContext<number>(RoleType.ADMIN);

const RoleContext = ({ children }: any) => {
  const [role, setRole] = useState<number>(RoleType.ADMIN);
  const location = useLocation();
  const { pathname } = location;
  useEffect(() => {}, [pathname]);
  return <Context.Provider value={role}>{children}</Context.Provider>;
};

export { RoleContext, Context };
