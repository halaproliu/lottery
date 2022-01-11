import React from 'react'
// import Lottery from '@/components/Lottery'
import { HashRouter, Routes, Route } from 'react-router-dom'
import routes from './routes'
function App() {
  return (
    <HashRouter>
      <Routes>
        {
          routes.map((route) => {
            return (<Route key={route.title} path={route.path} element={<route.component />}></Route>)
          })
        }
      </Routes>
    </HashRouter>
  );
}

export default App;
