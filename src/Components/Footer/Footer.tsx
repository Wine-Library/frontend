import { Link, NavLink } from 'react-router-dom';
import s from './Footer.module.scss';
import { navLink } from '@/utils/utlis';
import logo from '../../assets/WineLibraryLogo.png';
import arrowUp from '../../assets/icons/Chevron Arrow up.svg';

export const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={s.footer}>
      <div className={s.footerLine}></div>
      <div className={s.footerContainer}>
        <nav className={s.footerNav}>
          <div className={s.footerLogo}>
            <Link to="/">
              <img className={s.footerLogoImg} src={logo} alt="Logo" />
            </Link>
          </div>
          <div className={s.footerNavs}>
            {navLink.map(link => (
              <nav className={s.footerNavList} key={link.id}>
                <li className={s.footerNavItem}>
                  <NavLink to={link.id} className={s.footerNavLink}>
                    {link.title}
                  </NavLink>
                </li>
              </nav>
            ))}
          </div>

          <div className={s.footerBack}>
            <p className={s.footerBackText}>Back to top</p>
            <button
              type="button"
              className={s.footerBackButton}
              onClick={handleScrollToTop}
            >
              <img src={arrowUp} alt="" className={s.footerBackButtonImg} />
            </button>
          </div>
        </nav>
      </div>
    </footer>
  )
}