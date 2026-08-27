import { Link } from 'react-router-dom';
import s from './Footer.module.scss';

import instagram from '../../assets/icons/instagram.svg';
import facebook from '../../assets/icons/facebook.svg';
import twitter from '../../assets/icons/twitter.svg';

export const Footer = () => {
  const width = window.innerWidth;
  const isTablet = width >= 768 && width <= 1023;

  return (
    <footer className={s.footer}>
      <div className={s.footerContainer}>
        <div className={s.footerTop}>
          <div className={s.footerText}>
            <Link className={s.footerTitle} to="/">
              Wine Library
            </Link>
            <div className={s.footerSubTitle}>
              Join the Wine Library Circle to receive tasting invitations,
              cellar updates, and botanical stories from independent
              growers.
            </div>
            <form className={s.footerSubscribeForm}>
              <input type="email" placeholder="Enter your email address" className={s.footerEmail} />
              <button type="submit" className={s.footerSubscribeButton}>
                Subscribe
              </button>
            </form>
          </div>
          {isTablet && (
            <div className={s.footerLineTop}></div>
          )}
          <div className={s.footerItemsTop}>
            <div className={s.footerItems}>
              <h3 className={s.footerNavTitle}>Explore</h3>
              <nav className={s.footerNav}>
                <ul className={s.footerList}>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/shop-all"
                    >
                      Shop All
                    </a>
                  </li>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/organic-wines"
                    >
                      Organic Wines
                    </a>
                  </li>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/sauternes"
                    >
                      Sauternes
                    </a>
                  </li>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/curated-packs"
                    >
                      Curated Packs
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className={s.footerItems}>
              <h3 className={s.footerNavTitle} id="footer-explore-heading">Company</h3>
              <nav className={s.footerNav} aria-labelledby="footer-explore-heading">
                <ul className={s.footerList}>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/shop-all">
                      Our Story
                    </a>
                  </li>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/organic-wines">
                      The Cellar
                    </a>
                  </li>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/sauternes">
                      Journal
                    </a>
                  </li>
                  <li className={s.footerItem}>
                    <a
                      className={s.footerItemLink}
                      href="/curated-packs">
                      Press Kit
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className={s.footerConnect}>
              <h3 className={s.footerNavTitle}>Connect</h3>
              <span className={s.footerEmailSpan}>hello@winelibrary.com</span>
              <div className={s.footerSocials}>
                <a href="" className={s.footerSocial}>
                  <img src={instagram} alt="" className={s.footerSocialImage} />
                </a>
                <a href="" className={s.footerSocial}>
                  <img src={facebook} alt="" className={s.footerSocialImage} />
                </a>
                <a href="" className={s.footerSocial}>
                  <img src={twitter} alt="" className={s.footerSocialImage} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={s.footerLine}></div>
          <div className={s.footerBottom}>
            <p className={s.footerBottomText}>
              © 2026 Wine Library. Sustainable & natural vintage.
            </p>
            <div className={s.footerBottomRight}>
              <p className={s.footerBottomText}>Terms of Use</p>
              <p className={s.footerBottomText}>Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}