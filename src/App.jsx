import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicio from './pages/Inicio';
import Personal from './pages/PersonalInformation';
import PersonalQuestions from './pages/PersonalQuestions';


import NavBar from './components/NavBar';

function App() {
  return (
    <HashRouter>
      <NavBar/>
      <div className="pt-20 px-4 dark:bg-gray-800 min-h-screen dark:text-white">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/questions" element={<PersonalQuestions />} />
       
        </Routes>
       </div>
    </HashRouter>
  );
}

export default App;
