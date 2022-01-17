import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import routes from '@/routes'
import Container from '@/components/Container'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'


function App() {
  const [ state, setState ] = useState(window.location.href)
  const [ locale ] = useState(zhCN)

  useEffect(() => {
    setState(window.location.href)
  }, [state])
  if (state.indexOf('/lottery') === -1) {
    return (
      <HashRouter>
        <ConfigProvider locale={locale}>
          <Container></Container>
        </ConfigProvider>
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
