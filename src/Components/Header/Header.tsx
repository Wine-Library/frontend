<<<<<<< HEAD
import s from './Header.module.scss';

import React from 'react';
import { TopBar } from '../TopBar/TopBar';

type Props = {};

export const Header: React.FC<Props> = () => {

  return (
    <header id="top" className={s.header}>
      <div className={s.headerContainer}>
        <TopBar/>
      </div>
    </header>
  );
};
=======
import './Header.module.scss';

export const Header = () => {
  return (
    <header className="header"></header>
  )
}
>>>>>>> ac19ec8b35e579b93b6f95d36d90e49db24319b4
