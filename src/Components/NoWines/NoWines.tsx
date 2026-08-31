import type { NavigateFunction } from 'react-router-dom';
import search from '../../assets/icons/search-brown.svg';
import arrowWhite from '../../assets/icons/arrow-right-white.svg';
import s from '../Wines/Wines.module.scss';

type Props = {
  navigate: NavigateFunction;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const NoWines: React.FC<Props> = ({ navigate, setQuery }) => {
  return (
    <div className={s.winesWrong}>
      <div className={s.winesWrongImageWrap}>
        <img src={search} alt="" className={s.winesWrongImg} />
      </div>
      <div className={s.winesWrongText}>
        <h2 className={s.winesWrongTitle}>
          Something went wrong
        </h2>
        <span className={s.winesWrongSubTitle}>
          We encountered an error loading our reserve cellar catalog.
          This is temporary—please refresh your collection index.
        </span>
      </div>
      <div className={s.winesWrongButtons}>
        <button onClick={() => setQuery('')} className={s.winesWrongButtonAgain}>
          Try Again
          <img src={arrowWhite} alt="" className="" />
        </button>
        <button onClick={() => navigate('/')} className={s.winesWrongButtonHome}>
          Go to Homepage
        </button>
      </div>
    </div>
  )
}