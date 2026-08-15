import { Header } from "../Header/Header";
import s from './Wines.module.scss';
import arrowRight from '../../assets/icons/Chevron (Arrow Right) grey.png';
import home from '../../assets/icons/Home.svg';
import clsx from "clsx";
import { Filters } from "../Filters/Filters";
import { getWines } from "@/api/wines";
import { useEffect, useMemo, useState } from "react";
import type { Wine } from "@/types";
import { useFavourites } from "@/context/FavouritesContext";
import AuthPage from "../Account/AuthPage";
import type { FilterValue } from "@/types/Filter";
import { getCountriesWines, getSortedWines, getTypesWines } from "@/utils/wines";
import { WineCard } from "../WineCard/WineCard";
import { Loader } from "../Loader/Loader";
import { useAsync } from "@/utils/hooks";
import ReactPaginateRaw from "react-paginate";

// Vite's dev-server dependency pre-bundling (esbuild) mis-detects react-paginate's
// UMD build as a plain CommonJS module and wraps it a second time, so the default
// import resolves to `{ default: ReactPaginate }` instead of the component itself.
// Unwrap defensively so this works the same in dev (esbuild) and prod (Rollup) builds.
const ReactPaginate = (
  typeof ReactPaginateRaw === 'function'
    ? ReactPaginateRaw
    : (ReactPaginateRaw as unknown as { default: typeof ReactPaginateRaw }).default
);

export const Wines = () => {
  const { data: wines, loading, error } = useAsync<Wine[]>(() => getWines(), []);

  const { favouritesItems } = useFavourites();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState<FilterValue>('Popular');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const displayedWines = useMemo(
    () => getSortedWines(getTypesWines(getCountriesWines(wines ?? [], selectedCountry), selectedType), selectedSortBy),
    [wines, selectedCountry, selectedType, selectedSortBy]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedWines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayedWines.slice(start, start + itemsPerPage);
  }, [displayedWines, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, selectedType, selectedSortBy]);

  const totalPages = Math.ceil(displayedWines.length / itemsPerPage);

  return (
    <div id="top" className={s.wines}>
      <Header />
      <div className={clsx(s.winesContent, 'pageContent')}>
        <div className={s.winesPath}>
          <img src={home} alt="" className={s.winesPathHome} />
          <img src={arrowRight} alt="" className={s.winesPathArrow} />
          <span className={s.winesPathSpan}>Wines</span>
        </div>
        <h1 className={s.winesTitle}>Wines Library</h1>
        <h3 className={s.winesSubtitle}>{(wines ?? []).length} wines · {favouritesItems.length} favourited</h3>
        <Filters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onCountrySelect={setSelectedCountry}
          selectedCountry={selectedCountry}
          selectedSortBy={selectedSortBy}
          setSelectedSortBy={setSelectedSortBy}
        />

        {loading && <Loader />}
        {error && <p>Error: {error.message}</p>}

        <div className={s.winesGrid}>
          {(wines ?? []).length === 0 ? (
            <p className={s.winesNullMessage}>No wines to show at the moment — check back soon.</p>
          ) : (
            paginatedWines.map((wine) => (
              <WineCard key={wine.id} wine={wine} setShowAuthModal={setShowAuthModal} />
            ))
          )}
        </div>
          {totalPages > 1 && (
          <div>
            <ReactPaginate
              containerClassName={s.winesPages}
              pageCount={totalPages}
              forcePage={currentPage - 1}
              onPageChange={({ selected }) => {
                setCurrentPage(selected + 1);
                document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
              }}
              previousLabel="‹"
              nextLabel="›"
              pageLinkClassName={s.winesPagesButton}
              activeLinkClassName={s.winesPagesButtonSelected}
              previousLinkClassName={s.winesPagesButton}
              nextLinkClassName={s.winesPagesButton}
              breakLinkClassName={s.winesPagesButton}
              disabledClassName={s.winesPagesDisabled}
            />
          </div>
        )}
        {showAuthModal && <AuthPage setShowAuthModal={setShowAuthModal} />}
      </div>
    </div>
  );
};

export default Wines;