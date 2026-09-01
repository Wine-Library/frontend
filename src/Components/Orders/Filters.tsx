import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import s from './Orders.module.scss';
import chevronDown from '../../assets/icons/chevron-down.svg';

export type DateRangeValue = '3m' | '6m' | '1y' | 'all';
export type StatusValue = 'all' | 'Pending' | 'Delivered' | 'In Transit';

const DATE_RANGE_OPTIONS: { value: DateRangeValue; label: string }[] = [
  { value: '3m', label: 'Past 3 months' },
  { value: '6m', label: 'Past 6 months' },
  { value: '1y', label: 'Past year' },
  { value: 'all', label: 'All time' },
];

const STATUS_OPTIONS: { value: StatusValue; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'In Transit', label: 'In Transit' },
];

type Props = {
  dateRange: DateRangeValue;
  onDateRangeChange: (value: DateRangeValue) => void;
  status: StatusValue;
  onStatusChange: (value: StatusValue) => void;
};

type OpenFilter = 'date' | 'status' | null;

export const Filters: React.FC<Props> = ({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
}) => {
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openFilter) return;

    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenFilter(null);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openFilter]);

  const dateLabel =
    DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)?.label ??
    DATE_RANGE_OPTIONS[0].label;
  const statusLabel =
    STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    STATUS_OPTIONS[0].label;

  return (
    <div className={s.orderHistoryFilters} ref={wrapRef}>
      <div className={s.orderHistoryFilterWrap}>
        <button
          type="button"
          className={s.orderHistoryFilter}
          onClick={() => setOpenFilter((prev) => (prev === 'date' ? null : 'date'))}
          aria-haspopup="listbox"
          aria-expanded={openFilter === 'date'}
        >
          {dateLabel}
          <img
            src={chevronDown}
            alt=""
            className={clsx(
              s.orderHistoryFilterIcon,
              openFilter === 'date' && s.orderHistoryFilterIconOpen
            )}
          />
        </button>
        {openFilter === 'date' && (
          <div className={s.orderHistoryOpenFilters} role="listbox">
            {DATE_RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === dateRange}
                className={clsx(
                  s.orderHistoryOpenFilter,
                  option.value === dateRange && s.orderHistoryOpenFilterActive
                )}
                onClick={() => {
                  onDateRangeChange(option.value);
                  setOpenFilter(null);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={s.orderHistoryFilterWrap}>
        <button
          type="button"
          className={s.orderHistoryFilter}
          onClick={() => setOpenFilter((prev) => (prev === 'status' ? null : 'status'))}
          aria-haspopup="listbox"
          aria-expanded={openFilter === 'status'}
        >
          {statusLabel}
          <img
            src={chevronDown}
            alt=""
            className={clsx(
              s.orderHistoryFilterIcon,
              openFilter === 'status' && s.orderHistoryFilterIconOpen
            )}
          />
        </button>
        {openFilter === 'status' && (
          <div className={s.orderHistoryOpenFilters} role="listbox">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === status}
                className={clsx(
                  s.orderHistoryOpenFilter,
                  option.value === status && s.orderHistoryOpenFilterActive
                )}
                onClick={() => {
                  onStatusChange(option.value);
                  setOpenFilter(null);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
