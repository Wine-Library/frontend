import clsx from 'clsx';
import s from './Profile.module.scss';
import { useAuth } from '@/context';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import userImage from '../../assets/useImg.png';
import { getProfile } from '@/utils';
import { formatAddress } from '@/utils/address';
import grape from '../../assets/icons/grape.svg';
import { useMediaQuery } from '@/utils/hooks';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1199.98px)');

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className={clsx(s.profile)}>
      <Header />
      <div className={s.profileCardPhone}>
        <div className={s.profileImageWrap}>
          <img src={userImage} alt="" className={s.profileImage} />
        </div>
        <div className={s.profileCardText}>
          <h2 className={s.profileCardName}>{user.name} {user.surname}</h2>
          <p className={s.profileCardMemberSince}>Member since 2023</p>
        </div>
      </div>
      <div className={s.profileContent}>
        <div className={s.profileCard}>
          <div className={s.profileCardTop}>
            <div className={s.profileImageWrap}>
              <img src={userImage} alt="" className={s.profileImage} />
            </div>
            <div className={s.profileCardText}>
              <h2 className={s.profileCardName}>{user.name} {user.surname}</h2>
              <p className={s.profileCardMemberSince}>Member since 2023</p>
            </div>
          </div>
          {isTablet && <div className={s.profileLine}></div>}
          <nav className={s.profileNav}>
            <ul className={s.profileNavList}>
              <NavLink to="/profile" end className={getProfile(s)}>Profile</NavLink>
              <NavLink to="/favourites" className={getProfile(s)}>Favourites</NavLink>
              <NavLink to="/orders" className={getProfile(s)}>Orders</NavLink>
              <NavLink to="/basket" className={getProfile(s)}>Cart</NavLink>
              <button onClick={logout} className={clsx(s.profileSignout)}>Sign Out</button>
            </ul>
          </nav>
        </div>
        <div className={s.profileRightWrap}>
          <div className={s.profileMy}>
            <h2 className={s.profileMyTitle}>My Profile</h2>
            <ul className={s.profileMyList}>
              <li className={s.profileMyItem}>
                <h3 className={s.profileItemTitle}>
                  Full Name
                </h3>
                <div className={s.profileMyItemText}>{user.name} {user.surname}</div>
              </li>
              <div className={s.profileLine}></div>
              <li className={s.profileMyItem}>
                <h3 className={s.profileItemTitle}>
                  Email Address
                </h3>
                <div className={s.profileMyItemText}>{user.email}</div>
              </li>
              <div className={s.profileLine}></div>
              <li className={s.profileMyItem}>
                <h3 className={s.profileItemTitle}>
                  Phone Number
                </h3>
                <div className={s.profileMyItemText}>{user.phoneNumber}</div>
              </li>
              <div className={s.profileLine}></div>
              <li className={s.profileMyItem}>
                <h3 className={s.profileItemTitle}>
                  Shipping Address
                </h3>
                <div className={s.profileMyItemText}>{formatAddress(user)}</div>
              </li>
              <button onClick={() => navigate("change-data")} className={s.profileEdit}>Edit Profile</button>
            </ul>
          </div>
          <div className={s.profileOrders}>
            <h2 className={s.profileOrdersTitle}>Recent Orders</h2>
            <div className={s.proflieRecentOrdersBlock}>
              <div className={s.profileRecentOrdersImageWrap}>
                <img src={grape} alt="" className={s.profileRecentOrdersImage} />
              </div>
              <div className={s.profileOrdersText}>
                <h3 className={s.profileOrdersNoOrders}>
                  No orders yet
                </h3>
                <p className={s.profileOrdersSubtext}>
                  Start exploring our collection and curated botanical allocations!
                </p>
              </div>
              <NavLink className={s.profileOrdersBack} to="/wines">
                Browse Wines
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;