import React from 'react';
import Index from './pages/Index';
import ToyCatalog from './pages/ToyCatalog';
import Parent from './pages/Parent';
import { Route, Routes } from 'react-router-dom';

type RouteData = {
  path: string;
  element: JSX.Element;
}

function App() : JSX.Element {
  const routes : RouteData[] = [
    { path: "/index", element: <Index /> },
    { path: "/toycatalog", element: <ToyCatalog /> },
    { path: "/parent", element: <Parent /> },
    { path: "/", element: <Index /> },
  ];
  return (
    <div id="container">
      <Routes>
          { routes.map((route, i) => {
            return <Route key={i} path={route.path} element={route.element} />
          }) }
      </Routes>
    </div>
  );
}

export default App;
