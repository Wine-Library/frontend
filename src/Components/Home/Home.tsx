import { Header } from "../Header/Header";
import { Main } from "../Main/Main";
import './Home.scss';

export const Home = () => {
  return (
    <div className="home">
      <Header />
      <Main />
    </div>
  );
}