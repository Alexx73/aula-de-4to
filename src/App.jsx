import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicio from './pages/Inicio';
import Personal from './pages/PersonalInformation';
import PersonalQuestions from './pages/PersonalQuestions';
import Dialog1 from './pages/Dialog1';


import NavBar from './components/NavBar';

function App() {
  return (
    <HashRouter>
      <NavBar/>
      <div className="pt-20 px-4 dark:bg-gray-800 min-h-screen dark:text-white">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/questions" element={<PersonalQuestions />} />
          <Route path="/dialog1" element={<Dialog1 />} />


          
       
        </Routes>
       </div>
    </HashRouter>
  );
}

export default App;
