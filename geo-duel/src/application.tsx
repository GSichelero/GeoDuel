import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { HomeForm, EnterRoom, Match } from './pages/room';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/GeoDuel" element= {<EnterRoom/>} />
        <Route path="/GeoDuel/createroom" element= {<HomeForm/>} />
        <Route path="/GeoDuel/play" element= {<EnterRoom/>} />
        <Route path="/GeoDuel/match" element= {<Match/>} />
      </Routes>
    </Router>
  );
};
export default App;