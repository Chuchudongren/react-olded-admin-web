import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
// import { SideMenu } from '../../../iconsList.js'
import './index.css'
const { Sider } = Layout
const { SubMenu } = Menu

const menuListDemo = [
    { title: '首页', key: '/home' },
    { title: '用户管理', key: '/user', children: [{ title: '用户列表', key: '/userlist' }] },
    { title: '新闻资讯', key: '/news' },
    { title: '生活服务', key: '/life' },
    { title: '健康管理', key: '/health' },
    { title: '论坛', key: '/hoard' }
]
function SideMenu(props) {
    const [menuList, setMenuList] = useState([])
    const navigate = useNavigate()
    useEffect(() => {

    }, [])
    const selectKeys = window.location.pathname
    const openKeys = ['/' + selectKeys.split('/')[1]]
    const renderMenu = (menuList) => {
        return menuList.map((item) => {
            if (item.children?.length > 0)
                return (
                    <SubMenu
                        icon={SideMenu[item.title]}
                        key={item.key}
                        title={item.title}
                    >
                        {renderMenu(item.children)}
                    </SubMenu>
                )
            return (
                <Menu.Item
                    icon={SideMenu[item.title]}
                    key={item.key}
                    onClick={() => {
                        navigate('/blank')
                        navigate(item.key)
                    }}
                >
                    {item.title}
                </Menu.Item>
            )
        })
    }

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div className="siderMenu">
                {props.isCollapsed ? (
                    <div className="logo">老</div>
                ) : (
                    <div className="logo">老来乐后台管理</div>
                )}
                <div className="menu">
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={selectKeys}
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                    >
                        {renderMenu(menuListDemo)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

export default connect((state) => ({ isCollapsed: state.IsCollapsed }), {

})(SideMenu)