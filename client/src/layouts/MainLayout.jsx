import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function MainLayout() {
  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb--one" />
      <div className="bg-orb bg-orb--two" />
      <Navbar />
      <main className="container page-shell">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
