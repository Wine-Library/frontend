import { Header } from "../Header/Header";
import s from './Wines.module.scss';
import arrowRight from '../../assets/icons/Chevron (Arrow Right) grey.png';
import home from '../../assets/icons/Home.svg';
import clsx from "clsx";
import { Filters } from "../Filters/Filters";
import { searchWines, type PageResponse } from "@/api/wines";
import { useEffect, useState } from "react";
import type { Wine } from "@/types";
import { useFavourites } from "@/context/FavouritesContext";
import AuthPage from "../Account/AuthPage";
import type { FilterValue } from "@/types/Filter";
import { WineCard } from "../WineCard/WineCard";
import { Loader } from "../Loader/Loader";
import { useAsync } from "@/utils/hooks";
import ReactPaginateRaw from "react-paginate";
import { NavLink } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import { mapWineType, SORT_MAP } from "@/utils/filter";

const ReactPaginate = (
  typeof ReactPaginateRaw === 'function'
    ? ReactPaginateRaw
    : (ReactPaginateRaw as unknown as { default: typeof ReactPaginateRaw }).default
);

export const Wines = () => {
  const { favouritesItems } = useFavourites();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState<FilterValue>('Popular');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const mappedType = mapWineType(selectedType);

  const { data: winesPage, loading, error } = useAsync<PageResponse<Wine>>(
    () => searchWines({
      wineTypes: mappedType ? [mappedType] : undefined,
      countriesOfOrigin:
        !selectedCountry || selectedCountry === 'All' ? undefined : [selectedCountry],
      sort: SORT_MAP[selectedSortBy],
      page: currentPage - 1,
      size: itemsPerPage,
    }),
    [selectedType, selectedCountry, selectedSortBy, currentPage]
  );

  // Fetched once, unfiltered — used only to populate the country filter's
  // options. Filters must not derive their options from `wines` below,
  // since that's the current filtered/paginated page: filtering by a
  // country would narrow the dropdown to just that country with no way
  // back to "All".
  const { data: allWinesPage } = useAsync<PageResponse<Wine>>(
    () => searchWines({ size: 1000 }),
    []
  );

  const wines = winesPage?.content ?? [];
  const totalPages = winesPage?.totalPages ?? 0;
  const totalElements = winesPage?.totalElements ?? 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, selectedType, selectedSortBy]);

  return (
    <div id="top" className={s.wines}>
      <Header />
      <div className={clsx(s.winesContent, 'pageContent')}>
        <div className={s.winesPath}>
          <NavLink className={s.winesPathHomeLink} to="/">
            <img src={home} alt="" className={s.winesPathHome} />
          </NavLink>
          <img src={arrowRight} alt="" className={s.winesPathArrow} />
          <span className={s.winesPathSpan}>Wines</span>
        </div>
        <h1 className={s.winesTitle}>Wines Library</h1>
        <h3 className={s.winesSubtitle}>{totalElements} wines · {favouritesItems.length} favourited</h3>
        <Filters
          wines={allWinesPage?.content ?? []}
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
          {totalElements === 0 ? (
            <p className={s.winesNullMessage}>No wines to show at the moment — check back soon.</p>
          ) : (
            wines.map((wine) => (
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
      <Footer />
    </div>
  );
};

export default Wines;