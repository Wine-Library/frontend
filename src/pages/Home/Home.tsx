import { Header } from "@/Components/Header/Header";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import s from './Home.module.scss';
import { Footer } from "@/Components/Footer/Footer";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={s.home}>
      <Header
        setIsSearch={() => {}}
        isSearch={false}
        onSearchClick={() => navigate('/wines?search=')}
      />
      <div className={s.homeMain}>
        <MainLayout />
      </div>
      <Footer />
    </div>
  );
};