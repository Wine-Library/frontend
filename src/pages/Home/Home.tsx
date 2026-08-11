import { Header } from "@/components/Header/Header";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import './Home.module.scss';

export const Home = () => {
  return (
    <div className="home">
      <Header />
      <MainLayout />
    </div>
  );
}