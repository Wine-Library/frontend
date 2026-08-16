import { Header } from "@/Components/Header/Header";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import s from './Home.module.scss';

export const Home = () => {
  return (
    <div className={s.home}>
      <Header />
      <MainLayout />
    </div>
  );
}