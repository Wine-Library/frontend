import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import closeSearch from '../../assets/icons/closeSearch.svg';
import search from '../../assets/icons/search.svg';
import clsx from 'clsx';
import s from '../TopBar/TopBar.module.scss';
import useSearchQuery, { useAsync } from '@/utils/hooks';
import { searchWines, type PageResponse } from '@/api/wines';
import type { Wine } from '@/types';
import { Loader } from '../Loader/Loader';

type Props = {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isSearch: boolean;
  query?: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
  onSearchClick?: () => void;
};

export const Search: React.FC<Props> = ({ onSearchClick, setIsSearch, isSearch, query: queryProp, setQuery: setQueryProp }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: winesPage, loading, error } = useAsync<PageResponse<Wine>>(
    () => searchWines({ size: 1000 }),
    []
  );

  const wines = winesPage?.content ?? [];
  const { query, setQuery } = useSearchQuery(
    wines,
    (wine, q) => wine.wineName.toLowerCase().includes(q.toLowerCase()),
    queryProp !== undefined && setQueryProp ? { query: queryProp, setQuery: setQueryProp } : undefined
  );

  useEffect(() => {
    if (isSearch) inputRef.current?.focus();
  }, [isSearch]);

  const closeSearchHandler = () => {
    setIsSearch(false);
    setQuery('');
  };

  const changeQueryHandler = (value: string) => {
    setQuery(value);
    const trimmed = value.trim();
    if (trimmed) {
      navigate(`/wines?search=${encodeURIComponent(trimmed)}`, { replace: true });
    } else if (location.pathname.startsWith('/wines')) {
      navigate('/wines', { replace: true });
    }
  };

  const submitSearchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return isSearch ? (
    <div className={s.navSearchWrapper}>
      <form
        className={s.navForm}
        role="search"
        onSubmit={submitSearchHandler}
      >
        <img src={search} alt="" className={clsx(s.navSearchImage, s.navSearchSearch)} />
        <input
          ref={inputRef}
          type="search"
          className={s.navSearch}
          placeholder="Search..."
          value={query}
          onChange={(e) => changeQueryHandler(e.target.value)}
        />
        <button
          type="button"
          onClick={closeSearchHandler}
          className={s.navSearchCloseButton}
          aria-label="Close search"
        >
          <img src={closeSearch} alt="" className={clsx(s.navSearchImage, s.navSearchClose)} />
        </button>
      </form>
    </div>
  ) : (
    <button
      onClick={() => (onSearchClick ? onSearchClick() : setIsSearch(true))}
      className={s.navVectorButton}
    >
      <span className={clsx(s.navFav, s.navButton)}>
        <img src={search} aria-label="Search" className={s.navFavImg} alt="Search" />
      </span>
    </button>
  );
};