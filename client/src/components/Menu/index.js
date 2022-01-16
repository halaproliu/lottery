import { Menu } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import {
    UserOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    SettingOutlined
} from '@ant-design/icons'

const MyMenu = () => {
    const location = useLocation()
    const pathname = location.pathname
    return (
        <Menu
            defaultSelectedKeys={[pathname]}
            mode="inline"
            theme="dark">
            <Menu.Item key="/prize" icon={<i className="fa fa-shopping-bag" aria-hidden="true" />}>
                <Link to="/prize">奖品列表</Link>
            </Menu.Item>
            <Menu.Item key="/user" icon={<UserOutlined/>}>
                <Link to="/user">用户列表</Link>
            </Menu.Item>
            <Menu.Item key="/winners" icon={<UserAddOutlined />}>
                <Link to="/winners">中奖用户列表</Link>
            </Menu.Item>
            <Menu.Item key="/notArriveUsers" icon={<UserDeleteOutlined />}>
                <Link to="/notArriveUsers">中奖未到场用户列表</Link>
            </Menu.Item>
            <Menu.Item key="/setting" icon={<SettingOutlined />}>
                <Link to="/setting">设置</Link>
            </Menu.Item>
        </Menu>
    )
}

export default MyMenu
