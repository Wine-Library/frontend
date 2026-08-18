import { useEffect, useState } from 'react';
import s from './Filters.module.scss';
import { filterMainWineTypes, filterValues, type FilterValue } from '@/types/Filter';
import arrowDown from '../../assets/icons/arrow-down.svg';
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

export const Filters: React.FC<Props> = ({ wines, selectedCountry, selectedType, setSelectedType, onCountrySelect, setSelectedSortBy, selectedSortBy }) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    setCountries(['All', ...getUniqueCountries(wines)]);
  }, [wines]);

  return (
    <div className={s.filters}>
      <div className={s.filtersBlock}>
        <div className={s.filtersTitle}>Sort by</div>
        <button onClick={() => setSortOpen(p => !p)} className={s.filtersButton}>{selectedSortBy}<img src={arrowDown} alt="" className={s.filtersIcon} /></button>
        <div className={clsx(s.filtersOpenBlock, sortOpen && s.filtersOpenBlockGray)}>
          {sortOpen && filterValues.map((sort) => (
            <button key={sort} onClick={() => { setSelectedSortBy(sort); setSortOpen(false); }} className={s.filtersOpen}>
              {sort}
            </button>
          ))}
        </div>
      </div>
      <div className={s.filtersBlock}>
        <div className={s.filtersTitle}>Wines type</div>
        <button onClick={() => setTypeOpen(p => !p)} className={s.filtersButton}>{selectedType}<img src={arrowDown} alt="" className={s.filtersIcon} /></button>
        <div className={clsx(s.filtersOpenBlock, typeOpen && s.filtersOpenBlockGray)}>
          {typeOpen && filterMainWineTypes.map((type) => (
            <button key={type} onClick={() => { setSelectedType(type); setTypeOpen(false); }} className={s.filtersOpen}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className={s.filtersBlock}>
        <div className={s.filtersTitle}>Countries of wines</div>
        <button onClick={() => setCountryOpen(p => !p)} className={`${s.filtersButton}`}>{selectedCountry || 'Select country'} <img src={arrowDown} alt="" className={s.filtersIcon} /></button>
        <div className={clsx(s.filtersOpenBlock, s.filtersOpenBlockCountry, countryOpen && s.filtersOpenBlockGray)}>
          {countryOpen && countries.map((country) => (
            <button
              key={country}
              onClick={() => {
                onCountrySelect(country === 'All' ? '' : country);
                setCountryOpen(false);
              }}
              className={s.filtersOpen}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}