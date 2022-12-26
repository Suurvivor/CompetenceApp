import './App.css';
import Helmet from 'react-helmet';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Header from './components/layout/Header';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { User_page_index } from './components/user_page/User_page_index';
import PrivateRoute from './components/routing/PrivateRoute';

import AuthState from './context/auth/AuthState';
import TreeState from './context/tree/TreeState';
import { Tree } from './components/tree/Tree';
import AlertState from './context/alert/AlertState';
import Alerts from './components/layout/Alerts';
import BoxMidCardState from './context/boxMidCard/BoxMidCardState';
import BoxMidCard from './components/layout/BoxMidCard';
import Users from './components/users/Users';
import UsersState from './context/users/UsersState';

axios.defaults.baseURL = 'http://192.168.0.80:5000/api/v1';

function App() {
   return (
      <AuthState>
         <AlertState>
            <TreeState>
               <BoxMidCardState>
                  <UsersState>
                     <Helmet>
                        <script src='https://kit.fontawesome.com/5e4c917eea.js' crossorigin='anonymous'></script>
                     </Helmet>
                     <BrowserRouter>
                        <div id='main'>
                           <Header />
                           <Alerts />
                           <BoxMidCard />
                           <Routes>
                              <Route path='/' element={<PrivateRoute component={User_page_index} />} />
                              <Route path='login' element={<Login />} />
                              <Route path='register' element={<Register />} />
                              <Route path='users' element={<PrivateRoute component={Users} />} />
                              <Route path='users/:userId' element={<PrivateRoute component={Users} />} />
                              <Route path='tree' element={<PrivateRoute component={Tree} />} />
                           </Routes>
                        </div>
                     </BrowserRouter>
                  </UsersState>
               </BoxMidCardState>
            </TreeState>
         </AlertState>
      </AuthState>
   );
}

export default App;
