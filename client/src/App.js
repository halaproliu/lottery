import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import routes from '@/routes'
import Container from '@/components/Container'


function App() {
  const [ state, setState ] = useState(window.location.href)

  useEffect(() => {
    setState(window.location.href)
  }, [state])
  if (state.indexOf('/lottery') === -1) {
    return (
      <HashRouter>
        <Container></Container>
      </HashRouter>
    )
  }
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
