import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { HomeForm } from './pages/room';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/createroom" element= {<HomeForm/>} />
      </Routes>
    </Router>
  );
};
export default App;