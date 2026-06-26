import { createContext, useContext, useState, ReactNode } from 'react';
import { FieldConfig } from '../engine/types';
import { accountsConfig } from './accountsConfig';

interface ConfigContextValue {
  config: FieldConfig;
  setConfig: (c: FieldConfig) => void;
}

const ConfigContext = createContext<ConfigContextValue>({
  config: accountsConfig,
  setConfig: () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<FieldConfig>(accountsConfig);
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
