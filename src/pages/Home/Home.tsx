import { Header } from "@/components/Header/Header";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import s from './Home.module.scss';

export const Home = () => {
  return (
    <div className={s.home}>
import './Home.module.scss';

export const Home = () => {
  return (
    <div className="home">
      <Header />
      <MainLayout />
    </div>
  );
}