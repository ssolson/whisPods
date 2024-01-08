'use client';

import { useApp } from './useApp';

export function useSearch() {
  const { state, setState } = useApp();

  const performSearch = async (term: string) => {
    try {
      console.log('term', term);
      const response = await fetch(`/api/search/${encodeURIComponent(term)}`);
      const data = await response.json();
      console.log('data', data);
      if (data && Array.isArray(data.data)) {
        setState(() => ({
          ...state,
          searchResultEpisodes: data.data,
          hasSearched: true,
        }));
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const clearSearchResults = () => {
    setState(() => ({
      ...state,
      searchResultEpisodes: [],
    }));
    setState(() => ({
      ...state,
      hasSearched: false,
    }));
  };

  return { performSearch, clearSearchResults };
}
