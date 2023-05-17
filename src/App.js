import logo from './logo.svg';
import './App.css';
import Home from './Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useState } from 'react';
import Login from './login';
import Coin from './coin/coin';
import { MantineProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';


function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const [countal, setCountal] = useState([])

  const [login, setLogin] = useState()



  return (
    <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>

      <div>
        <Router>
          <Routes>
            <Route exact path='/' element={<Home  />} />
            <Route exact path='/login' element={<Login setlogin={setLogin} />} />
            <Route exact path='/coin' element={<Coin setCountal={setCountal}  />} />
            {/* <Route exact path='/open' element={< />}/> */}
          </Routes>
        </Router>
      </div>
    </MantineProvider>
  );
}

export default App;
