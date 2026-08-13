import s from './MainLayout.module.scss';
import './MainLayout.module.scss';
import slideImageDinner from '../../assets/ChatGPT Image 13 ago 2026, 05_39_04.png';
import slideImageCelebration from '../../assets/ChatGPT Image 13 ago 2026, 05_40_51.png';
import welcomeImageGift from '../../assets/ChatGPT Image 13 ago 2026, 05_41_54.png';
import { Link } from 'react-router-dom';
import { useCallback, useState } from 'react';
import arrowRight from '../../assets/icons/Chevron (Arrow Right).svg';
import arrowLeft from '../../assets/icons/Chevron (Arrow Left).svg';

export const MainLayout = () => {
  const occasionImages = [slideImageDinner, slideImageCelebration, welcomeImageGift];
  const occasionTitles = ['Made for the Table', 'Raise a Glass to the Moment', 'Give Something Worth Remembering'];
  const occasionSubtitles = ['Rich flavors, slow evenings, and a bottle worth opening. Let every course have its perfect pour.', 'From milestones to unforgettable nights, choose a wine that makes every toast taste a little better.', 'A carefully chosen bottle says more than words ever could. Make their next occasion truly special.'];
  const widt = window.innerWidth;
  const [picIndex, setPicIndex] = useState(0);

    const handlePicChange = useCallback(
    (direction: 'next' | 'prev') => {
      const nextIndex =
        direction === 'next'
          ? (picIndex + 1) % occasionImages.length
          : (picIndex - 1 + occasionImages.length) % occasionImages.length;

      setPicIndex(nextIndex);
    },
    [picIndex, occasionImages.length],
  );

  return (
    <main className={s.main}>
      <div className={s.mainContent}>
        <div className={s.mainTitle}>Welcome to Wine Library!</div>
        <div className={s.mainSliders}>
              <button
                type="button"
                className={s.mainSliderButton}
                onClick={() => handlePicChange('prev')}
              >
                <img src={arrowLeft} className={s.mainSliderIcon} alt="" />
              </button>
              {/* <Link to="/phones"> */}
              <div className={s.mainSliderImg}>
                <div
                  className={s.mainSliderTrack}
                  style={{ transform: `translateX(-${picIndex * 100}%)` }}
            >
                  {occasionImages.map((slide, index) => (
                    <div key={index} className={s.mainSlide}>
                      {widt >= 768 ? (
                        <div className={s.mainBanner}>
                          <div className={s.mainOrder}>
                            <div className={s.mainOrderText}>
                              <p className={s.mainOrderTitle}>
                                  {occasionTitles[index]}
                              </p>
                              <span className={s.mainOrderDescription}>
                                {occasionSubtitles[index]}
                              </span>
                            </div>
                            <Link
                              to={
                                index === 0
                                  ? '/wines'
                                  : index === 1
                                    ? '/wines'
                                    : '/wines'
                              }
                            >
                              <button className={s.mainOrderBtn}>
                                Order Now
                              </button>
                            </Link>
                          </div>
                          <div className={s.mainImg}>
                            <img
                              src={slide}
                              className={s.mainImage}
                              alt={`Welcome Slide ${index + 1}`}
                            />
                          </div>
                        </div>
                      ) : (
                        <img
                          className={s.mainImage}
                          src={slide}
                          alt={`Welcome Slide ${index + 1}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* </Link> */}
              <button
                type="button"
                className={s.mainSliderButton}
                onClick={() => handlePicChange('next')}
              >
                <img src={arrowRight} className={s.mainSliderIcon} alt="" />
              </button>
        </div>
      </div>
    </main>
  )
}
