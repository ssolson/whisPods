'use client';

import Link from 'next/link';
import { GiHamburgerMenu, GiSoundWaves } from 'react-icons/gi';
import YoutubeDrawer from './components/YoutubeDrawer';
import { useApp } from './hooks/useApp';
import SearchBar from './components/SearchBar';
import { useSearch } from './hooks/useSearch';

const links = [
  { name: 'HOME', href: '/' },
  { name: 'PODCASTS', href: '/podcasts' },
  { name: 'ABOUT', href: '/about' },
];

export default function Navbar() {
  const { state, setState } = useApp();

  const navMenuToggle = () => {
    setState((prevState) => ({
      ...prevState,
      isMenuModalOpen: !prevState.isMenuModalOpen,
    }));
  };

  return (
    <div className="max-w-screen">
      <div
        className={`z-10 flex h-24 items-center justify-between duration-300`}
      >
        <div
          className={`${state.isMenuModalOpen ? ' rounded-none' : 'lg:rounded-br-2xl'}  flex h-24 w-full flex-row-reverse items-center justify-between gap-4 bg-black bg-opacity-[96%] px-4 duration-300 lg:w-64 lg:flex-row lg:justify-center lg:px-6`}
        >
          {/* TLDL Title */}
          <div
            onClick={navMenuToggle}
            className={`${
              state.isMenuModalOpen
                ? 'rotate-90 text-baseText1'
                : 'rotate-0 text-baseText'
            } z-50 flex h-12 w-12 items-center justify-center rounded-md border bg-base3 p-1 text-4xl duration-300`}
          >
            <GiHamburgerMenu />
          </div>
          <Link href={'/'}>
            <p className="text-4xl font-semibold">TLDL</p>
            <h1 className="mt-1 text-xs text-baseText1">
              Too Long Didn't Listen
            </h1>
          </Link>
        </div>

        {/* Search */}
        <div
          className={`absolute left-0 right-0 top-6 mx-auto hidden w-11/12 flex-col items-center justify-center duration-300 lg:block lg:w-1/2`}
        >
          <SearchBar/>
        </div>

        {/*NavMenu */}
        <div
          onBlur={navMenuToggle}
          className={`${state.isMenuModalOpen ? 'left-0' : '-left-[100%]'} absolute top-24 mx-auto flex w-full flex-col justify-center gap-2 bg-black bg-opacity-[96%] px-8 pb-8 duration-300 lg:w-64 lg:rounded-br-2xl lg:px-10 lg:pt-4`}
        >
          <div
            className={`mb-2 w-full flex-col items-center justify-center duration-300 lg:hidden`}
          >
            <SearchBar />
          </div>
          {links.map((link, i) => (
            <Link
              onClick={navMenuToggle}
              href={link.href}
              className="text-2xl hover:text-baseText1"
            >
              <p>{link.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/*Youtube Drawer */}
      <div
        className={`${
          state.isVideoModalOpen
            ? 'h-[350px] border-t border-white border-opacity-40'
            : 'h-0'
        } fixed bottom-0 z-50 w-full bg-base1 duration-300`}
      >
        <YoutubeDrawer />
      </div>
    </div>
  );
}
