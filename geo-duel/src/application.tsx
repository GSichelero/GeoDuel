import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { HomeForm, EnterRoom, Match } from './pages/room';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element= {<EnterRoom/>} />
        <Route path="/createroom" element= {<HomeForm/>} />
        <Route path="/play" element= {<EnterRoom/>} />
        <Route path="/match" element= {<Match/>} />
      </Routes>
    </Router>
  );
};
export default App;