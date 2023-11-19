import React from 'react';
import Index from './pages/Index';
import ToyCatalog from './pages/ToyCatalog';
import Parent from './pages/Parent';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import './assets/css/styles.css'
<<<<<<< HEAD
import RankToys from './pages/RankToys';
=======
import ParentTaskPage from './pages/ParentTaskPage';
>>>>>>> 69321233c34882cb0ffee82c272a63741e66a2ce

type RouteData = {
  path: string;
  element: JSX.Element;
}

function App() : JSX.Element {
  const routes : RouteData[] = [
    { path: "/index", element: <Index /> },
    { path: "/toycatalog", element: <ToyCatalog /> },
    { path: "/parent", element: <Parent /> },
<<<<<<< HEAD
    { path: "/ranktoys", element: <RankToys /> },
=======
    { path: "/parent/tasks", element: <ParentTaskPage /> },
>>>>>>> 69321233c34882cb0ffee82c272a63741e66a2ce
    { path: "/", element: <Index /> },
  ];
  return (
    <div id="container">
      <NavBar/>
      <Routes>
          { routes.map((route, i) => {
            return <Route key={i} path={route.path} element={route.element} />
          }) }
      </Routes>
    </div>
  );
}

export default App;
