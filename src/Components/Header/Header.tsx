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
