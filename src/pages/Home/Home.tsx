import { Header } from "@/components/Header/Header";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import s from './Home.module.scss';
import { Footer } from "@/components/Footer/Footer";

export const Home = () => {
  return (
    <div className={s.home}>
      <Header />
      <MainLayout />
      <div className={s.homeFooter}>
        <Footer />
      </div>
import './Home.module.scss';

export const Home = () => {
  return (
    <div className="home">
      <Header />
      <MainLayout />
    </div>
  );
}