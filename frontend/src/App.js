import './App.css';

import { LeftSide } from "./components/leftside/leftside"
import { Main } from './components/Main/main';
import { Create } from './components/create post/create';
import { PublicationPage } from './components/publication-page/publication-page';
import { Profile } from './components/profile/profile';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginButtons } from './components/login/login-buttons';
import { LoginPage } from './components/login/login-page';
import { Signup } from './components/login/signup';


function App() {
  console.log("App");
  return (
    <BrowserRouter>
      <div className="App">
        <LeftSide />
        <LoginButtons />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/create_post' element={<Create />} />
          <Route path='/post/:id' element={<PublicationPage />} />
          <Route path='/messages' element={<div>In dev</div>} />
          <Route path='/profile/' element={<div><Profile /></div>} />
          <Route path='/profile/:id' element={<div><Profile /></div>} />
          <Route path='/settings' element={<div>In dev</div>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
