import { Routes, Route } from 'react-router-dom';
import { Header } from '@components/Layout/Header';
import { Footer } from '@components/Layout/Footer';
import Home from '@pages/Home';
import TokenHub from '@pages/TokenHub';
import CampaignList from '@pages/CampaignList';
import CampaignDetail from '@pages/CampaignDetail';
import CreateCampaign from '@pages/CreateCampaign';
import AdminPanel from '@pages/AdminPanel';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tokens" element={<TokenHub />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaign/:address" element={<CampaignDetail />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
      </div>
  );
}

export default App;
