'use client';

import { AppState } from '../../types';
import React, { createContext, useState, ReactNode } from 'react';

export const initialState: AppState = {
  isVideoModalOpen: false,
  searchResultEpisodes: null,
  latestEpisodes: null,
  currentEpisode: null,
  currentYouTubeVideo: null,
  hasSearched: false,
  searchTerm: '',
  currentSegment: null,
  isMenuModalOpen: false,
};

export const AppStateContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}>({
  state: initialState,
  setState: () => {},
});

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>(initialState);

  return (
    <AppStateContext.Provider value={{ state, setState }}>
      {children}
    </AppStateContext.Provider>
  );
};
