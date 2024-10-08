// EmailContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface EmailContextProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const EmailContext = createContext<EmailContextProps | undefined>(undefined);

export const EmailProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string>("");

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = (): EmailContextProps => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
};
