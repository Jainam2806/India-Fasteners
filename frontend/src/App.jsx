import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import WeightCalculator from './pages/WeightCalculator';
import Diagrams from './pages/Diagrams';
import HSNCodes from './pages/HSNCodes';
import Standards from './pages/Standards';

// Styles
import './styles/index.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<WeightCalculator />} />
          <Route path="/diagrams" element={<Diagrams />} />
          <Route path="/hsn" element={<HSNCodes />} />
          <Route path="/standards" element={<Standards />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
