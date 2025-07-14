import React, { createContext, useContext } from 'react';

interface AppContextType {
  // Minimal context for ChatboxEditor
}

const defaultAppContext: AppContextType = {};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
};