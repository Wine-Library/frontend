import { Header } from "@/Components/Header/Header";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import s from './Home.module.scss';
import { Footer } from "@/Components/Footer/Footer";

export const Home = () => {
  return (
    <div className={s.home}>
      <Header />
      <div className={s.homeMain}>
        <MainLayout />
      </div>
      <Footer />
<<<<<<< HEAD
=======
      <MainLayout />
      <div className={s.homeFooter}>
        <Footer />
      </div>
>>>>>>> 5281f8d13bfab7c48a363a1ffe1ece1a7b60eca0
    </div>
  );
}