import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { MovieTaskList } from './components/MovieTaskList/MovieTaskListComponent';
import RegistrationPage from './components/Registration/RegistrationPageComponent';


function App() {
    return (
      
      <div id="App">
        <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">סרטים וסדרות</Link>
              </li>
              <li>
                <Link to="/register">רישום סרט או סדרה חדשים</Link>
              </li>
            </ul>
          </nav>
          <br />
          <br />
          <br />
          <Routes>
            <Route path="/register" Component={RegistrationPage} />
            <Route path="/" Component={MovieTaskList} />
          </Routes>
        </div>
      </Router>
      </div>
    );
}
export default App;
