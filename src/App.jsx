import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CompareBar from './components/compare/CompareBar';
import Dashboard from './components/dashboard/Dashboard';
import PlantDetailModal from './components/dashboard/PlantDetailModal';
import Microgreens from './components/microgreens/Microgreens';
import LearnPage from './components/learn/LearnPage';
import ZoneMap from './components/learn/ZoneMap';
import FrostDateCalculator from './components/learn/FrostDateCalculator';
import SoilTestingGuide from './components/learn/SoilTestingGuide';
import NativePlantsArticle from './components/learn/NativePlantsArticle';
import WinterCareGuide from './components/learn/WinterCareGuide';
import FavoritesPage from './components/favorites/FavoritesPage';
import ComparePage from './components/compare/ComparePage';
import GardenPlanner from './components/garden/GardenPlanner';
import CompanionPlanting from './components/companions/CompanionPlanting';
import IPMGuide from './components/ipm/IPMGuide';
import SeedStarting from './components/seeds/SeedStarting';

/** App shell with React Router v6 routes. */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/plant/:id"
            element={
              <>
                <Dashboard />
                <PlantDetailModal />
              </>
            }
          />
          <Route path="/microgreens" element={<Microgreens />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/zones" element={<ZoneMap />} />
          <Route path="/learn/planting" element={<FrostDateCalculator />} />
          <Route path="/learn/soil-testing" element={<SoilTestingGuide />} />
          <Route path="/learn/native-plants" element={<NativePlantsArticle />} />
          <Route path="/learn/winter-care" element={<WinterCareGuide />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/garden-planner" element={<GardenPlanner />} />
          <Route path="/companions" element={<CompanionPlanting />} />
          <Route path="/ipm" element={<IPMGuide />} />
          <Route path="/seed-starting" element={<SeedStarting />} />
        </Routes>
      </main>
      <Footer />
      <CompareBar />
    </div>
  );
}
