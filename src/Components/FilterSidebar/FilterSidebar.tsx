import { useEffect, useState } from 'react';
import s from './FilterSidebar.module.scss';
import { filterMainWineTypes, filterValues, type FilterValue } from '@/types/Filter';
import filterActive from '../../assets/icons/filterActive.svg';
import clsx from 'clsx';
import { getUniqueCountries } from '@/utils/filter';
import type { Wine } from '@/types';
import starFilled from '../../assets/icons/star-filled.svg';
import starUnfilled from '../../assets/icons/star-unfilled.svg';

type Props = {
  setSelectedSortBy: React.Dispatch<React.SetStateAction<FilterValue>>;
  selectedSortBy: FilterValue;
  onCountrySelect: React.Dispatch<React.SetStateAction<string>>;
  selectedCountry: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
  wines: Wine[];
  selectedRating: number;
  minPrice: number;
  maxPrice: number;
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  setSelectedRating: React.Dispatch<React.SetStateAction<number>>;
}

function useAnimatedDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const shouldRender = isOpen || isClosing;

  const close = () => { setIsClosing(true); setIsOpen(false); };
  const toggle = () => (isOpen ? close() : setIsOpen(true));
  const onAnimationEnd = () => { if (isClosing) setIsClosing(false); };
  const dropdownClassName = isClosing ? s.filtersDropdownClosing : s.filtersDropdown;

  return { isOpen, shouldRender, close, toggle, onAnimationEnd, dropdownClassName };
}

export const FilterSideBar: React.FC<Props> = ({ minPrice, setMinPrice, maxPrice, setMaxPrice, setSelectedRating, selectedRating, wines, selectedCountry, selectedType, setSelectedType, onCountrySelect, setSelectedSortBy, selectedSortBy }) => {
  const typeDropdown = useAnimatedDropdown();
  const countryDropdown = useAnimatedDropdown();
  const [countries, setCountries] = useState<string[]>([]);
  const STAR_COUNT = 5;

  useEffect(() => {
    setCountries(['All', ...getUniqueCountries(wines)]);
  }, [wines]);

  return (
    <div className={clsx(s.filterSidebar, s.filterSidebarWrap)}>
      <h2 className={s.filterSidebarTitle}>
        Filters
      </h2>
      <div className={s.filterSidebarBlock}>
        <h3 className={s.filterSidebarBlockTitle}>Sort By</h3>
        <ul className={s.filterSidebarBlockList}>
          {filterValues.map((sort) => (
            <li key={sort} className={s.filtersOpen}>
              <button
                type="button"
                onClick={() => setSelectedSortBy(sort)}
                className={clsx(s.filtersCheckbox, selectedSortBy === sort && s.filterCheckboxActive)}
                aria-pressed={selectedSortBy === sort}
              >
                {selectedSortBy === sort && <img src={filterActive} alt="" />}
              </button>
              <p className={s.filterSelectText}>{sort}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.filterSidebarBlock}>
        <h3 className={s.filterSidebarBlockTitle}>Type</h3>
        <ul className={s.filterSidebarBlockList}>
          {filterMainWineTypes.map((type) => (
            <li key={type} className={s.filtersOpen}>
              <button
                type="button"
                onClick={() => { setSelectedType(type); typeDropdown.close(); }}
                className={clsx(s.filtersCheckbox, selectedType === type && s.filterCheckboxActive)}
                aria-pressed={selectedType === type}
              >
                {selectedType === type && <img src={filterActive} alt="" />}
              </button>
              <p className={s.filterSelectText}>{type}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.filterSidebarBlockCountry}>
        <h3 className={s.filterSidebarBlockTitle}>Region</h3>
        <ul className={s.filterSidebarBlockList}>
          {countries.map((country) => {
            const isActive = selectedCountry === country;
            return (
              <li key={country} className={s.filtersOpen}>
                <button
                  type="button"
                  onClick={() => {
                    onCountrySelect(country);
                    countryDropdown.close();
                  }}
                  className={clsx(s.filtersCheckbox, isActive && s.filterCheckboxActive)}
                  aria-pressed={isActive}
                >
                  {isActive && <img src={filterActive} alt="" />}
                </button>
                <span className={s.filterSelectText}>{country}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={s.filterSidebarBlock}>
        <h2 className={s.filterSidebarBlockTitle}>
          Price range
        </h2>
        <div className={s.filterSidebarBlockInputs}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Min $0"
            value={minPrice === 0 ? '' : `Min $${minPrice}`}
            onChange={(e) => setMinPrice(Number(e.target.value.replace(/\D/g, '')) || 0)}
            className={s.filterSidebarBlockInput}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Max $100"
            value={maxPrice === 0 ? '' : `Max $${maxPrice}`}
            onChange={(e) => setMaxPrice(Number(e.target.value.replace(/\D/g, '')) || 0)}
            className={s.filterSidebarBlockInput}
          />
        </div>
      </div>
      <div className={s.filterSidebarBlock}>
        <h2 className={s.filterSidebarBlockTitle}>
          Minimum Rating
        </h2>
        <div className={s.filterSidebarBlockRating}>
          {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              type="button"
              className={s.filterSidebarBlockRatingButton}
              onClick={() => setSelectedRating(star === selectedRating ? 0 : star)}
              aria-label={`${star} star${star > 1 ? 's' : ''} and up`}
            >
              <img
                src={star <= selectedRating ? starFilled : starUnfilled}
                alt=""
                className={s.filterSidebarBlockRatingIcon}
              />
            </button>
          ))}
          <span className={s.filterSidebarBlockRatingLabel}>&amp; Up</span>
        </div>
      </div>
    </div>
  );
}