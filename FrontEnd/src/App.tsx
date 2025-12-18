import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './Components/Header'; // <--- Importe o Header
import { Dashboard } from './Pages/Dashboard';
import { People } from './Pages/People';
import { Transactions } from './Pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<People />} />
          <Route path="/transacoes" element={<Transactions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;