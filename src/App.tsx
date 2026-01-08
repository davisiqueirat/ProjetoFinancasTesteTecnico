import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './Components/Header'; 
import { Dashboard } from './Pages/Dashboard';
import { People } from './Pages/People';
import { Transactions } from './Pages/Transactions';
import { Categories } from './Pages/Categories';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<People />} />
          <Route path="/transacoes" element={<Transactions />} />
          <Route path="/categorias" element={<Categories />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;