import React, { createContext, useContext, useState, useEffect } from 'react';

export const stateContext = createContext();

const getFreshContext = () => {
  // ako je prazan setiraj na nulu
  if (localStorage.getItem('context') === null)
    localStorage.setItem(
      'context',
      JSON.stringify({
        participantId: 0,
        timeTaken: 0,
        selectedOptions: [],
      }),
    );

  return JSON.parse(localStorage.getItem('context'));
};

export default function useStateContext() {
  const { context, setContext } = useContext(stateContext);
  return {
    context,
    setContext: (obj) => {
      setContext({ ...context, ...obj });
    },
    resetContext: () => {
      localStorage.removeItem('context');
      setContext(getFreshContext());
    },
  };
}

export function ContextProvider({ children }) {
  const [context, setContext] = useState(getFreshContext());

  // kad god se promjeni podatak spremiti ce se u localstorage
  useEffect(() => {
    console.log('Mijenam local storage -', context);
    localStorage.setItem('context', JSON.stringify(context));
  }, [context]);

  return (
    <stateContext.Provider value={{ context, setContext }}>
      {children}
    </stateContext.Provider>
  );
}
