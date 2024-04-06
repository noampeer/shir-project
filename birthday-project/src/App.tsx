import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { MovieTaskList } from './components/MovieTaskList/MovieTaskListComponent';
import RegistrationPage from './components/Registration/RegistrationPageComponent';
import { Task } from './components/Task/TaskComponent';


function App() {
    return (
      
      <div id="App">
        <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/movies">סרטים</Link>
              </li>
              <li>
                <Link to="/register">רישום סרטים חדשים</Link>
              </li>
            </ul>
          </nav>
          <br />
          <br />
          <br />
          <Routes>
            <Route path="/register" Component={RegistrationPage} />
            <Route path="/movies" Component={MovieTaskList} />
          </Routes>
        </div>
      </Router>
      </div>
    );
}
export default App;
