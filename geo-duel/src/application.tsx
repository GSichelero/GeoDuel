import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { HomeForm, EnterRoom } from './pages/room';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/createroom" element= {<HomeForm/>} />
        <Route path="/play" element= {<EnterRoom/>} />
      </Routes>
    </Router>
  );
};
export default App;