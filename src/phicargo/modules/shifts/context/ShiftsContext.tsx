import { ReactNode, createContext, useState } from 'react';

interface ShiftsContextProps {
  branchId: number;
  setBranchId: (branchId: number) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ShiftsContext = createContext<ShiftsContextProps>(
  {} as ShiftsContextProps,
);

export const ShiftsProvider = ({ children }: { children: ReactNode }) => {
  const [branchId, setBranchId] = useState<number>(1);

  return (
    <ShiftsContext.Provider
      value={{
        branchId: branchId,
        setBranchId: setBranchId,
      }}
    >
      {children}
    </ShiftsContext.Provider>
  );
};
