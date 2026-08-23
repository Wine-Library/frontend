import s from './StarRating.module.scss';

type StarRatingProps = {
  rating: number; // e.g. wine.rating = 4.8
  maxStars?: number;
};

export const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  return (
    <div className={s.starRating}>
      {Array.from({ length: maxStars }, (_, i) => {
        const fillPercent = Math.min(Math.max(rating - i, 0), 1) * 100;
        return <StarIcon key={i} fillPercent={fillPercent} />;
      })}
    </div>
  );
};

const STAR_PATH = "M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5z";

const StarIcon: React.FC<{ fillPercent: number }> = ({ fillPercent }) => (
  <span className={s.starWrapper}>
    <svg viewBox="0 0 20 20" className={s.star} width={16} height={16}>
      <path d={STAR_PATH} />
    </svg>
    <span className={s.starFilledClip} style={{ width: `${fillPercent}%` }}>
      <svg viewBox="0 0 20 20" className={s.starFilled} width={16} height={16}>
        <path d={STAR_PATH} />
      </svg>
    </span>
  </span>
);