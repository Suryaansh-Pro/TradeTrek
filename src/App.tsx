import { AppProviders } from './context';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import Backtest from './pages/Backtest';
import Account from './pages/Account';
import Header from './components/Header';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <AppProviders>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/backtest" element={<Backtest />} />
              <Route path="/account" element={<Account />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </AppProviders>
    </Router>
  );
}

export default App;