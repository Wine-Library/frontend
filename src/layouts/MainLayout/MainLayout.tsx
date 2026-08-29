import s from './MainLayout.module.scss';
import './MainLayout.module.scss';
import arrowRight from '../../assets/icons/arrow-right.svg';
import { Link } from 'react-router-dom';
import { searchWines, type PageResponse } from '@/api/wines';
import type { Wine } from '@/types';
import { useAsync } from '@/utils/hooks';
import arrowRightBrown from '../../assets/icons/arrow-right-brown.svg';
import { StarRating } from '@/Components/StarRating/StarRating';
import leaf from '../../assets/icons/leaf.svg';
import users from '../../assets/icons/users.svg';
import award from '../../assets/icons/award.svg';
import { CartButton } from '@/Components/CartButton/CartButton';
import clsx from 'clsx';

export const MainLayout = () => {
  const { data: winesPage } = useAsync<PageResponse<Wine>>(
      () => searchWines({ size: 1000 }),
      []
    );
  const width = window.innerWidth;
  const isTablet = width >= 768 && width <= 1023;
  const isDesktop = width >= 1024 && width <= 1440;

  const wines = winesPage?.content ?? [];
  const topRatedWines = [...wines]
    .sort((a, b) => b.popularityRating - a.popularityRating)
    .slice(0, isTablet ? 4 : isDesktop ? 3 : 3);

  return (
    <main className={s.main}>
      <div className={s.mainContent}>
        <div className={s.mainTop}>
          <div className={s.mainLeft}>
            <div className={s.mainTitle}>Discover <br /> Exceptional Wines</div>
            <div className={s.mainSubTitle}>
              Carefully sourced natural, organic, and biodynamic wines from small-scale growers who respect the land. Cultivated with care, poured with intention.
            </div>
            <Link to="/wines" className={s.mainButton}>
              <img src={arrowRight} className={s.mainButtonImage}/>
              <span className={s.mainButtonSpan}>Browse Collection</span>
            </Link>
          </div>
          <div className={s.mainRight}></div>
        </div>
      </div>
      <div className={s.mainStats}>
        <div className={s.mainStatSide}>
          <div className={s.mainStat}>
            <h3 className={s.mainStatsTitle}>
              60+
            </h3>
            <p className={s.mainStatsSubtitle}>
              Natural Wines
            </p>
          </div>
          <div className={s.mainStatsLine}></div>
          <div className={s.mainStat}>
            <h3 className={s.mainStatsTitle}>
              13
            </h3>
            <p className={s.mainStatsSubtitle}>
              Wine Regions
            </p>
          </div>
        </div>
        <div className={clsx(s.mainStatsLineBetween)}></div>
        <div className={s.mainStatSide}>
          <div className={s.mainStat}>
            <h3 className={s.mainStatsTitle}>
              50+
            </h3>
            <p className={s.mainStatsSubtitle}>
              Independent Growers
            </p>
          </div>
          <div className={s.mainStatsLine}></div>
          <div className={s.mainStat}>
            <h3 className={s.mainStatsTitle}>
              100%
            </h3>
            <p className={s.mainStatsSubtitle}>
              Organic & Biodynamic
            </p>
          </div>
        </div>
      </div>
      <div className={s.mainMostloved}>
        <div className={s.mainMostlovedContainer}>
          <div className={s.mainMostlovedText}>
            <div className={s.sectionTitle}>
              Most Loved Bottles
            </div>
            <div className={s.mainMostlovedSubtitle}>
              Our customers' favorites, handpicked by our cellar team
            </div>
          </div>
          <div className={s.mainGrid}>
            {topRatedWines.map((wine) => (
            <div key={wine.id} className={s.mainCard}>
              <Link to={`/wines/${wine.id}`} className={s.mainCardLink}>
                <div className={s.mainImageWrap}>
                  <p className={s.mainCardType}>{wine.wineType} Wine</p>
                  <img src={wine.productImage} alt={wine.wineName} className={s.mainImage} />
                </div>
                <div className={s.mainCardText}>
                  <h3 className={s.mainCardName}>{wine.wineName}</h3>
                  <p className={s.mainCardCountry}>
                    {wine.countryOfOrigin} • {wine.year}
                  </p>
                </div>
                <div className={s.mainCardRating}>
                  <StarRating rating={wine.popularityRating} />
                  <span className={s.mainCardRatingText}>{wine.popularityRating}</span>
                </div>
                <div className={s.mainWinesBottom}>
                  <span className={s.mainCardPrice}>${wine.price}</span>
                  <div className={s.mainCardButtons}>
                    <CartButton wine={wine} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
          </div>
          <Link to="/wines" className={s.mainViewAll}>
            <span className={s.mainViewAllSpan} >View All Wines </span>
            <img src={arrowRightBrown} alt="" className="" />
          </Link>
        </div>
      </div>
      <div className={s.mainShopOccacions}>
        <div className={s.mainShopOccacionsText}>
          <h2 className={s.sectionTitle}>
            Shop by Occasion
          </h2>
          <p className={s.mainShopOccacionsSubtitle}>
            Find the perfect bottle for every moment.
          </p>
        </div>
        <ul className={s.mainShopOccacionsList}>
          <li className={s.mainShopOccacionItem}>
          <div className={clsx(s.mainShopOccationImage, s.mainShopOccationImageDinner)}></div>
            <div className={s.mainOccacionItemText}>
              <h3 className={s.mainShopOccacionItemTitle}>
                Dinner Party
              </h3>
              <p className={s.mainShopOccacionItemDescription}>
                Structured reds and crisp whites for the table-elegant,
                refined, and built for sharing.
              </p>
              <Link className={s.mainShopOccacionItemLink} to="/wines">
                Shop Collection →
              </Link>
            </div>
          </li>
          <li className={s.mainShopOccacionItem}>
          <div className={clsx(s.mainShopOccationImage, s.mainShopOccationImageCelebration)}></div>
            <div className={s.mainOccacionItemText}>
              <h3 className={s.mainShopOccacionItemTitle}>
                Celebration
              </h3>
              <p className={s.mainShopOccacionItemDescription}>
                Bubbles, bright whites, and special-occasion
                reds to toast life's biggest moments.
              </p>
              <Link className={s.mainShopOccacionItemLink} to="/wines">
                Shop Collection →
              </Link>
            </div>
          </li>
          <li className={s.mainShopOccacionItem}>
            <div className={clsx(s.mainShopOccationImage, s.mainShopOccationImagePicnic)}></div>
            <div className={s.mainOccacionItemText}>
              <h3 className={s.mainShopOccacionItemTitle}>
                Sunlit Picnic
              </h3>
              <p className={s.mainShopOccacionItemDescription}>
                Refreshing, chillable wines that pair perfectly
                with sunshine, snacks, and good company.
              </p>
              <Link className={s.mainShopOccacionItemLink} to="/wines">
                Shop Collection →
              </Link>
            </div>
          </li>
          <li className={s.mainShopOccacionItem}>
          <div className={clsx(s.mainShopOccationImage, s.mainShopOccationImageCasual)}></div>
            <div className={s.mainOccacionItemText}>
              <h3 className={s.mainShopOccacionItemTitle}>
                Casual Pour
              </h3>
              <p className={s.mainShopOccacionItemDescription}>
                Easy-drinking favorites for a Tuesday
                night-light, bright, and full of everyday charm.
              </p>
              <Link className={s.mainShopOccacionItemLink} to="/wines">
                Shop Collection →
              </Link>
            </div>
          </li>
        </ul>
      </div>
      <div className={s.mainWhy}>
        <div className={s.mainWhyText}>
          <h2 className={s.sectionTitle}>
            Why Wine Library
          </h2>
          <p className={s.mainWhySubtitle}>
            We believe wine should be a connection to the earth
            the grower, and the moment.
          </p>
        </div>
        <ul className={s.mainWhyList}>
          <li className={s.mainWhyItem}>
            <div className={s.mainWhyImage}>
              <img src={leaf} alt="" />
            </div>
            <h2 className={s.mainWhyItemTitle}>
              Sustainably Sourced
            </h2>
            <p className={s.mainWhyItemSubtitle}>
              We partner with growers who prioritize soil health,
              biodiversity, and low-intervention farming.
            </p>
          </li>
          <li className={s.mainWhyItem}>
            <div className={s.mainWhyImage}>
              <img src={users} alt="" />
            </div>
            <h2 className={s.mainWhyItemTitle}>
              Small Batch Growers
            </h2>
            <p className={s.mainWhyItemSubtitle}>
              We support independent producers who make wine
              with care, not volume-unique character in every bottle.
            </p>
          </li>
          <li className={s.mainWhyItem}>
            <div className={s.mainWhyImage}>
              <img src={award} alt="" />
            </div>
            <h2 className={s.mainWhyItemTitle}>Expert Curated</h2>
            <p className={s.mainWhyItemSubtitle}>
              Our team tastes every bottle to ensure every
              collection is balanced, interesting, and ready to pour.
            </p>
          </li>
        </ul>
      </div>
    </main>
  )
}
