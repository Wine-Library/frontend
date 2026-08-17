import React from 'react';
import s from './Loader.module.scss';

export const Loader: React.FC = () => {
  return (
    <div className={s.loader} data-cy="loader">
      <div className={s.loaderContent} />
    </div>
  );
};
