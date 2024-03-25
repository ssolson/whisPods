'use client';
import { useState, useRef } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useApp } from '../../hooks/useApp';
import { useRouter } from 'next/navigation';

export const SearchBar = () => {
  const { state, setState } = useApp();
  const [inputValue, setInputValue] = useState<string>('');
  const router = useRouter();

  // Handle search submission
  const handleSearch = (inputValue: string) => {
    if (!inputValue.trim()) return; // Do nothing for empty search
    router.push(`/search/${encodeURIComponent(inputValue)}`);
  };

  // Clear search results
  const clearSearchResults = () => {
    setInputValue('');
    setState((prevState) => ({
      ...prevState,
      hasSearched: false,
    }));
  };

  return (
    <div className="relative z-20 flex w-full items-center">
      <input
        type="text"
        placeholder="Search for episodes..."
        className="h-12 w-full rounded-md border border-gray-200 bg-black bg-opacity-[96%] py-2 pl-10 pr-10 transition-colors duration-150 hover:bg-base2 focus:border-[#9c22ee] focus:bg-black focus:outline-none md:shadow-lg md:shadow-base"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch(inputValue);
        }}
      />

      {inputValue && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 py-2 transition-colors duration-150 focus:outline-none"
          onClick={clearSearchResults}
        >
          <IoClose className="text-[#9c22ee]" />
        </button>
      )}

      <div
        className="absolute inset-y-0 left-3 flex cursor-pointer items-center"
        onClick={() => handleSearch(inputValue)}
      >
        <IoSearch className="text-[#9c22ee]" />
      </div>
    </div>
  );
};

export default SearchBar;
