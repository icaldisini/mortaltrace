import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Overview } from './pages/Overview';
import { DataExploration } from './pages/DataExploration';
import { Preprocessing } from './pages/Preprocessing';
import { AssociationRules } from './pages/AssociationRules';
import { Clustering } from './pages/Clustering';
import { Regression } from './pages/Regression';
import { InteractiveMaps } from './pages/InteractiveMaps';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/data-exploration" element={<DataExploration />} />
          <Route path="/preprocessing" element={<Preprocessing />} />
          <Route path="/association-rules" element={<AssociationRules />} />
          <Route path="/clustering" element={<Clustering />} />
          <Route path="/regression" element={<Regression />} />
          <Route path="/interactive-maps" element={<InteractiveMaps />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
