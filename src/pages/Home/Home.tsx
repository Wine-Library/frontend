import { Header } from "@/components/Header/Header";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
<<<<<<< HEAD
import s from './Home.module.scss';

export const Home = () => {
  return (
    <div className={s.home}>
=======
import './Home.module.scss';

export const Home = () => {
  return (
    <div className="home">
>>>>>>> ac19ec8b35e579b93b6f95d36d90e49db24319b4
      <Header />
      <MainLayout />
    </div>
  );
}