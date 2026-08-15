import { Header } from "../Header/Header";
import s from './Wines.module.scss';
import arrowRight from '../../assets/icons/Chevron (Arrow Right) grey.png';
import home from '../../assets/icons/Home.svg';
import clsx from "clsx";
import { Filters } from "../Filters/Filters";
import { getWines } from "@/api/wines";
import { useMemo, useState } from "react";
import type { Wine } from "@/types";
import { useFavourites } from "@/context/FavouritesContext";
import AuthPage from "../Account/AuthPage";
import type { FilterValue } from "@/types/Filter";
import { getCountriesWines, getSortedWines, getTypesWines } from "@/utils/wines";
import { WineCard } from "../WineCard/WineCard";
import { Loader } from "../Loader/Loader";
import { useAsync } from "@/utils/hooks";

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
        <div className={s.winesPages}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => {
                setCurrentPage(page);
                document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={clsx(s.winesPagesButton, currentPage === page && s.winesPagesButtonSelected)}
            >
              {page}
            </button>
          ))}
        </div>

        {showAuthModal && <AuthPage setShowAuthModal={setShowAuthModal} />}
      </div>
    </div>
  );
};

export default Wines;