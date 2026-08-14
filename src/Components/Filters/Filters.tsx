import { useState } from 'react';
import './Filters.module.scss';
import s from './Filters.module.scss';
import { winescountriesApi } from '@/utils/wines';
import { filterMainWineTypes, filterValues, type FilterValue } from '@/types/Filter';
import arrowDown from '../../assets/icons/arrow-down.svg';
import clsx from 'clsx';
type Props = {
  setSelectedSortBy: React.Dispatch<React.SetStateAction<FilterValue>>;
  selectedSortBy: FilterValue;
  onCountrySelect: React.Dispatch<React.SetStateAction<string>>;
  selectedCountry: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
}

export const Filters: React.FC<Props> = ({ selectedCountry, selectedType, setSelectedType, onCountrySelect, setSelectedSortBy, selectedSortBy }) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  return (
    <div className={s.filters}>
      <div className={s.filtersBlock}>
        <div className={s.filtersTitle}>Sort by</div>
        <button onClick={() => setSortOpen(!sortOpen)} className={s.filtersButton}>{selectedSortBy}<img src={arrowDown} alt="" className={s.filtersIcon} /></button>
        <div className={clsx(s.filtersOpenBlock, sortOpen && s.filtersOpenBlockGray)}>
          {sortOpen && filterValues.map((sort) => {
            return (
              <button key={sort} onClick={() => { setSelectedSortBy(sort);  setSortOpen(false)}} className={s.filtersOpen}>
                {sort}
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.filtersBlock}>
        <div className={s.filtersTitle}>Wines type</div>
        <button onClick={() => setTypeOpen(!typeOpen)} className={s.filtersButton}>{selectedType}<img src={arrowDown} alt="" className={s.filtersIcon} /></button>
          <div className={clsx(s.filtersOpenBlock, typeOpen && s.filtersOpenBlockGray)}>
            {typeOpen && filterMainWineTypes.map((type) => {
                return (
                  <button key={type} onClick={() => { setSelectedType(type);  setTypeOpen(false)}} className={s.filtersOpen}>
                    {type}
                  </button>
                );
              })}
          </div>  
      </div>
      <div className={s.filtersBlock}>
        <div className={s.filtersTitle}>Countries of wines</div>
        <button onClick={() => setCountryOpen(!countryOpen)} className={`${s.filtersButton}`}>{selectedCountry || 'Select country'} <img src={arrowDown} alt="" className={s.filtersIcon} /></button>
        <div className={clsx(s.filtersOpenBlock, s.filtersOpenBlockCountry, countryOpen && s.filtersOpenBlockGray)}>
          {countryOpen && winescountriesApi.map((country) => (
            <button
              key={country.id}
              onClick={() => { onCountrySelect(country.name); setCountryOpen(false) }}
              className={s.filtersOpen}
            >
              <img src={country.image} className={s.filtersOpenBlockFlag} alt={country.name} />
              {country.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}