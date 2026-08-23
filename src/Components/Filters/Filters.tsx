import { useEffect, useState } from 'react';
import s from './Filters.module.scss';
import { filterMainWineTypes, filterValues, type FilterValue } from '@/types/Filter';
import arrowDown from '../../assets/icons/arrow-down.svg';
import filterActive from '../../assets/icons/filterActive.svg';
import clsx from 'clsx';
import { getUniqueCountries } from '@/utils/filter';
import type { Wine } from '@/types';

type Props = {
  setSelectedSortBy: React.Dispatch<React.SetStateAction<FilterValue>>;
  selectedSortBy: FilterValue;
  onCountrySelect: React.Dispatch<React.SetStateAction<string>>;
  selectedCountry: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
  wines: Wine[];
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

export const Filters: React.FC<Props> = ({ wines, selectedCountry, selectedType, setSelectedType, onCountrySelect, setSelectedSortBy, selectedSortBy }) => {
  const sortDropdown = useAnimatedDropdown();
  const typeDropdown = useAnimatedDropdown();
  const countryDropdown = useAnimatedDropdown();
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    setCountries(['All', ...getUniqueCountries(wines)]);
  }, [wines]);

  return (
    <div className={s.filters}>
      <div className={s.filtersBlock}>
        <button onClick={sortDropdown.toggle} className={s.filtersButton}>
          <div className={s.filtersText}>
            <div className={s.filtersTitle}>Sort by</div>
            <div className={s.filterTextSelected}>{selectedSortBy}</div>
          </div>
          <img src={arrowDown} alt="" className={s.filtersIcon} />
        </button>
        {sortDropdown.shouldRender && (
          <ul
            className={clsx(s.filtersOpenBlock, s.filtersOpenBlockGray, sortDropdown.dropdownClassName)}
            onAnimationEnd={sortDropdown.onAnimationEnd}
          >
            {filterValues.map((sort) => (
              <li key={sort} className={s.filtersOpen}>
                <button
                  type="button"
                  onClick={() => { setSelectedSortBy(sort); sortDropdown.close(); }}
                  className={clsx(s.filtersCheckbox, selectedSortBy === sort && s.filterCheckboxActive)}
                  aria-pressed={selectedSortBy === sort}
                >
                  {selectedSortBy === sort && <img src={filterActive} alt="" />}
                </button>
                <p className={s.filterSelectText}>{sort}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={s.filtersBlock}>
        <button onClick={typeDropdown.toggle} className={s.filtersButton}>
          <div className={s.filtersText}>
            <div className={s.filtersTitle}>Wines type</div>
            <div className={s.filterTextSelected}>{selectedType}</div>
          </div>
          <img src={arrowDown} alt="" className={s.filtersIcon} />
        </button>
        {typeDropdown.shouldRender && (
          <ul
            className={clsx(s.filtersOpenBlock, typeDropdown.dropdownClassName)}
            onAnimationEnd={typeDropdown.onAnimationEnd}
          >
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
        )}
      </div>

      <div className={s.filtersBlock}>
        <button onClick={countryDropdown.toggle} className={s.filtersButton}>
          <div className={s.filtersText}>
            <div className={s.filtersTitle}>Countries of wines</div>
            <div className={s.filterTextSelected}>{selectedCountry || 'Select country'}</div>
          </div>
          <img src={arrowDown} alt="" className={s.filtersIcon} />
        </button>
        {countryDropdown.shouldRender && (
          <ul
            className={clsx(s.filtersOpenBlock, s.filtersOpenBlockCountry, s.filtersOpenBlockGray, countryDropdown.dropdownClassName)}
            onAnimationEnd={countryDropdown.onAnimationEnd}
          >
            {countries.map((country) => {
              const isActive = country === 'All' ? selectedCountry === 'All' : selectedCountry === country;
              return (
                <li key={country} className={s.filtersOpen}>
                  <button
                    type="button"
                    onClick={() => {
                      onCountrySelect(country === 'All' ? '' : country);
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
        )}
      </div>
    </div>
  );
}