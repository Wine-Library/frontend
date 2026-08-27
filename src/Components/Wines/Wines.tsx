import { Header } from "../Header/Header";
import s from './Wines.module.scss';
import clsx from "clsx";
import { Filters } from "../Filters/Filters";
import { searchWines, type PageResponse } from "@/api/wines";
import { useEffect, useMemo, useState } from "react";
import type { Wine } from "@/types";
import type { FilterValue } from "@/types/Filter";
import { WineCard } from "../WineCard/WineCard";
import { Loader } from "../Loader/Loader";
import useSearchQuery, { useAsync } from "@/utils/hooks";
import ReactPaginateRaw from "react-paginate";
import { NavLink, useSearchParams } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import { mapWineType, SORT_MAP } from "@/utils/filter";
import pathIcon from '../../assets/icons/PathIcon.svg';
import activeFilterDelete from '../../assets/icons/activeFilterDelete.svg';
import { FilterSideBar } from "../FilterSidebar/FilterSidebar";
import { LoginOverlay } from "../LoginOverlay/LoginOverlay";

const ReactPaginate = (
  typeof ReactPaginateRaw === 'function'
    ? ReactPaginateRaw
    : (ReactPaginateRaw as unknown as { default: typeof ReactPaginateRaw }).default
);

export const Wines = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search')?.trim() ?? '';

  const [selectedRating, setSelectedRating] = useState(0);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState<FilterValue>('Popular');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearch, setIsSearch] = useState(!!initialSearch);
  const itemsPerPage = isSearch ? 6 : 8;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  
  
  const mappedType = mapWineType(selectedType);
  
  type ActiveFilter = {
    key: 'sortBy' | 'country' | 'type' | 'rating' | 'price';
    value: string;
    onRemove: () => void;
  };

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = [];

    if (selectedSortBy !== 'Popular') {
      filters.push({
        key: 'sortBy',
        value: selectedSortBy,
        onRemove: () => setSelectedSortBy('Popular'),
      });
    }

    if (selectedCountry !== 'All') {
      filters.push({
        key: 'country',
        value: selectedCountry,
        onRemove: () => setSelectedCountry('All'),
      });
    }

    if (minPrice > 0 || maxPrice > 0) {
      filters.push({
        key: 'price',
        value: `$${minPrice || 0} - $${maxPrice || '∞'}`,
        onRemove: () => { setMinPrice(0); setMaxPrice(0); },
      });
    }

    if (selectedRating > 0) {
      filters.push({
        key: 'rating',
        value: `${selectedRating}+ stars`,
        onRemove: () => setSelectedRating(0),
      });
    }

    if (selectedType !== 'All') {
      filters.push({
        key: 'type',
        value: selectedType,
        onRemove: () => setSelectedType('All'),
      });
    }

    return filters;
  }, [selectedSortBy, selectedCountry, selectedType, selectedRating, minPrice, maxPrice]);

  async function handleClearAllFilters() {
    setSelectedSortBy('Popular');
    setSelectedCountry('All');
    setSelectedType('All');
    setSelectedRating(0);
    setMinPrice(0);
    setMaxPrice(0);
  }

  const { data: winesPage, loading, error } = useAsync<PageResponse<Wine>>(
    () => searchWines({
      wineTypes: mappedType ? [mappedType] : undefined,
      countriesOfOrigin:
        !selectedCountry || selectedCountry === 'All' ? undefined : [selectedCountry],
      sort: SORT_MAP[selectedSortBy],
      page: currentPage - 1,
      size: itemsPerPage,
    }),
    [selectedType, selectedCountry, selectedSortBy, currentPage, itemsPerPage]
  );

  const { data: allWinesPage } = useAsync<PageResponse<Wine>>(
    () => searchWines({ size: 1000 }),
    []
  );

  
  const wines = winesPage?.content ?? [];
  const totalPages = winesPage?.totalPages ?? 0;
  const totalElements = winesPage?.totalElements ?? 0;
  const { query, setQuery } = useSearchQuery(
    allWinesPage?.content ?? [],
    (wine, q) => wine.wineName.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    if (initialSearch) setQuery(initialSearch);
  }, []);

  const searchResults = useMemo(() => {
    let items = allWinesPage?.content ?? [];

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((wine) => wine.wineName.toLowerCase().includes(q));
    }
    if (mappedType) {
      items = items.filter((wine) => wine.wineType === mappedType);
    }
    if (selectedCountry && selectedCountry !== 'All') {
      items = items.filter((wine) => wine.countryOfOrigin === selectedCountry);
    }
    if (selectedRating > 0) {
      items = items.filter((wine) => wine.popularityRating >= selectedRating);
    }
    if (minPrice > 0) {
      items = items.filter((wine) => wine.price >= minPrice);
    }
    if (maxPrice > 0) {
      items = items.filter((wine) => wine.price <= maxPrice);
    }

    const [sortField, sortDir] = SORT_MAP[selectedSortBy].split(',');
    return [...items].sort((a, b) => {
      const aVal = sortField === 'price' ? a.price : a.popularityRating;
      const bVal = sortField === 'price' ? b.price : b.popularityRating;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [allWinesPage, query, mappedType, selectedCountry, selectedRating, selectedSortBy, minPrice, maxPrice]);

    const searchTotalPages = Math.ceil(searchResults.length / itemsPerPage);
    const paginatedSearchResults = useMemo(
      () => searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
      [searchResults, currentPage, itemsPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, selectedType, selectedSortBy, selectedRating, minPrice, maxPrice, isSearch, query]);

  return (
    <div id="top" className={clsx(s.wines, showAuthModal && s.winesOverflow )}>
      {loading && <Loader />}
      <Header setIsSearch={setIsSearch} isSearch={isSearch} query={query} setQuery={setQuery} />
      <div className={clsx(s.winesContent, 'pageContent')}>
        <div className={s.winesPath}>
          <NavLink className={s.winesPathHomeLink} to="/">
            <span className={s.winesPathHome}>Home</span>
          </NavLink>
          <img src={pathIcon} alt="" className={s.winesPathIconHome} />
          <span className={s.winesPathSpan}>Wines</span>
        </div>
        
        {isSearch ? (
          <div className={s.winesText}>
            <h1 className={s.winesTitle}>
              {query.trim() ? `Showing ${searchResults.length} results for "${query}"` : 'Search wines'}
            </h1>
          </div>
        ) : (
          <div className={s.winesText}>
            <h1 className={s.winesTitle}>Shop All Wines</h1>
            <h3 className={s.winesSubtitle}>Showing {totalElements} bottles curated with low-intervention commitment</h3>
          </div>
        )}
        {activeFilters.length > 0 && (
          <div className={s.winesActiveFilters}>
            <p className={s.winesActiveFiltersTitle}>
              Active Filters:
            </p>
            <ul className={s.winesActiveFiltersList}>
              {activeFilters.map((filter) => (
                <li key={filter.key} className={s.winesActiveFiltersItem}>
                  {filter.value}
                  <button
                    type="button"
                    className={s.winesActiveFiltersButton}
                    onClick={filter.onRemove}
                  >
                    <img src={activeFilterDelete} alt="Remove filter" className={s.winesActiveFiltersImage} />
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={handleClearAllFilters} className={s.winesActiveFiltersClear}>
              Clear All
            </button>
          </div>
          )}
        <div className={s.winesFiltersContainer}>
          <div className={clsx(s.winesSearchW, isSearch && s.winesSearchWrap)}>
            {!isSearch ? (
              <div className={s.winesFilterWrap}>
                <Filters
                  wines={allWinesPage?.content ?? []}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  onCountrySelect={setSelectedCountry}
                  selectedCountry={selectedCountry}
                  selectedSortBy={selectedSortBy}
                  setSelectedSortBy={setSelectedSortBy}
                />
              </div>
            ) : (
              <div className={s.filterSidebarWrap}>
                <FilterSideBar
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  wines={allWinesPage?.content ?? []}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  onCountrySelect={setSelectedCountry}
                  selectedCountry={selectedCountry}
                  selectedSortBy={selectedSortBy}
                  setSelectedSortBy={setSelectedSortBy}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                />
              </div>
            )}
            {error && <p>Error: {error.message}</p>}
            <div className={clsx(s.winesGrid, isSearch && s.winesGridSearch)}>
              {isSearch ? (
                searchResults.length === 0 ? (
                  <p className={s.winesNullMessage}>
                    {query.trim() ? `No wines found for "${query}".` : 'Start typing to search wines.'}
                  </p>
                ) : (
                  paginatedSearchResults.map((wine) => (
                    <div key={wine.id} className={s.winesWineSearchWrapper}>
                      <WineCard wine={wine} setShowAuthModal={setShowAuthModal} />
                    </div>
                  ))
                )
              ) : totalElements === 0 ? (
                <p className={s.winesNullMessage}>No wines to show at the moment — check back soon.</p>
              ) : (
                wines.map((wine) => (
                  <div key={wine.id} className={s.winesWineCardWrapper}>
                    <WineCard wine={wine} setShowAuthModal={setShowAuthModal} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {(isSearch ? searchTotalPages : totalPages) > 1 && (
          <div>
            <ReactPaginate
              containerClassName={s.winesPages}
              pageCount={isSearch ? searchTotalPages : totalPages}
              forcePage={currentPage - 1}
              onPageChange={({ selected }) => {
                setCurrentPage(selected + 1);
                document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
              }}
              previousLabel="Previous"
              nextLabel="Next"
              pageLinkClassName={s.winesPagesButton}
              activeLinkClassName={s.winesPagesButtonSelected}
              previousLinkClassName={s.winesPagesButtonSide}
              nextLinkClassName={s.winesPagesButtonSide}
              breakLinkClassName={s.winesPagesButton}
              disabledClassName={s.winesPagesDisabled}
            />
          </div>
        )}
        {showAuthModal && <LoginOverlay setShowAuthModal={setShowAuthModal} />}
      </div>
      <Footer />
    </div>
  );
};

export default Wines;