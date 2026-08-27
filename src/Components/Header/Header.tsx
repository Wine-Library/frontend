import s from './Header.module.scss';

import React, { useState } from 'react';
import { TopBar } from '../TopBar/TopBar';
import { Aside } from '../Aside/Aside';

type Props = {
  setIsSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  isSearch?: boolean;
  query?: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
  onSearchClick?: () => void;
};

export const Header: React.FC<Props> = ({ onSearchClick, setIsSearch: setIsSearchProp, isSearch: isSearchProp, query, setQuery }) => {
  const [internalIsSearch, setInternalIsSearch] = useState(false);
  const isSearch = isSearchProp ?? internalIsSearch;
  const setIsSearch = setIsSearchProp ?? setInternalIsSearch;

  return (
    <header id="top" className={s.header}>
      <div className={s.headerContainer}>
          <Aside />
          <TopBar setIsSearch={setIsSearch} onSearchClick={onSearchClick} isSearch={isSearch} query={query} setQuery={setQuery} />
      </div>
    </header>
  );
};
