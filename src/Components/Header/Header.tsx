import s from './Header.module.scss';

import React from 'react';
import { TopBar } from '../TopBar/TopBar';

type Props = {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isSearch: boolean;
  query?: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
  onSearchClick?: () => void;
};

export const Header: React.FC<Props> = ({ onSearchClick, setIsSearch, isSearch, query, setQuery }) => {

  return (
    <header id="top" className={s.header}>
      <div className={s.headerContainer}>
        <TopBar setIsSearch={setIsSearch} onSearchClick={onSearchClick} isSearch={isSearch} query={query} setQuery={setQuery} />
      </div>
    </header>
  );
};
