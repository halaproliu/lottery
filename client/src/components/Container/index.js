import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import routes from '@/routes'
import MyMenu from '@/components/Menu'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

function Container() {
  const [ collapsed, setCollapsed ] = useState(false)
  const toggle = () => {
    setCollapsed(!collapsed)
  }
  return (
    <Layout>
        <Sider
            collapsible
            collapsed={collapsed}>
            <div className="logo">
            <h3>抽奖系统</h3>
            </div>
            <MyMenu></MyMenu>
        </Sider>
        <Layout>
            <Header style={{ padding: 0, background: '#fff' }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  style: { marginLeft: '15px' },
                  onClick: toggle
              })}
            </Header>
            <Content
              style={{
                  margin: '10px 16px',
                  padding: 24,
                  minHeight: '100vh'
              }}>
              <Routes>
                {
                  routes.map((route) => {
                      return (<Route key={route.title} path={route.path} element={<route.component />}></Route>)
                  })
                }
              </Routes>
            </Content>
        </Layout>
    </Layout>
  );
}

export default Container;
