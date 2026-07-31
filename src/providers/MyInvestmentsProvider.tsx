import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Investment } from '@/src/features/investments/types/investment';

interface MyInvestmentsContextValue {
  readonly myInvestments: readonly Investment[];
  readonly addMyInvestment: (investment: Investment) => void;
}

const MyInvestmentsContext = createContext<MyInvestmentsContextValue | null>(
  null,
);

export function MyInvestmentsProvider({ children }: { children: ReactNode }) {
  const [myInvestments, setMyInvestments] = useState<readonly Investment[]>(
    [],
  );

  const addMyInvestment = (investment: Investment) => {
    setMyInvestments((previous) => [...previous, investment]);
  };

  return (
    <MyInvestmentsContext.Provider value={{ myInvestments, addMyInvestment }}>
      {children}
    </MyInvestmentsContext.Provider>
  );
}

export function useMyInvestments(): MyInvestmentsContextValue {
  const context = useContext(MyInvestmentsContext);

  if (!context) {
    throw new Error(
      'useMyInvestments must be used within MyInvestmentsProvider',
    );
  }

  return context;
}
