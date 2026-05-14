import { createContext, useContext, useState, ReactNode } from "react";

type DescuentosContextType = {
 isEditing: boolean;
 setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DescuentosContext = createContext<DescuentosContextType | undefined>(undefined);

type DescuentosProviderProps = {
 children: ReactNode;
};

export const DescuentosProvider = ({ children }: DescuentosProviderProps) => {
 const [isEditing, setIsEditing] = useState<boolean>(false);

 return (
  <DescuentosContext.Provider
   value={{
    isEditing,
    setIsEditing,
   }}
  >
   {children}
  </DescuentosContext.Provider>
 );
};

export const useDescuentos = () => {
 const context = useContext(DescuentosContext);

 if (!context) {
  throw new Error(
   "useDescuentos debe usarse dentro de un DescuentosProvider"
  );
 }

 return context;
};