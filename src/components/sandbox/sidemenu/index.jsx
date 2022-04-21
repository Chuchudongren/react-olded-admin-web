import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { SideMenuIcon } from '../../../iconsList.js'
import './index.css'
const { Sider } = Layout
const { SubMenu } = Menu

function SideMenu(props) {
    const [menuList, setMenuList] = useState([])
    const navigate = useNavigate()
    const token = qs.parse(localStorage.getItem('token'))
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        } else {
            axios.post('/admin/getRoleRights', qs.stringify({ roleid: token.roleid })).then(res => {
                setMenuList(res.data.results);
            })
        }
    }, [])
    const selectKeys = window.location.pathname
    const openKeys = ['/' + selectKeys.split('/')[1]]
    const renderMenu = (menuList) => {
        return menuList?.map((item) => {
            if (item.children?.length > 0)
                return (
                    <SubMenu
                        // icon={SideMenu[item.title]}
                        key={item.href}
                        title={item.title}
                    >
                        {renderMenu(item.children)}
                    </SubMenu>
                )
            return (
                <Menu.Item
                    icon={SideMenuIcon[item.title]}
                    key={item.href}
                    onClick={() => {
                        navigate('/blank')
                        navigate(item.href)
                    }}
                >
                    {item.title}
                </Menu.Item>
            )
        })
    }
    return (
        <Sider width={'230px'} trigger={null} collapsible collapsed={props.isCollapsed}>
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
                        {renderMenu(menuList)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

export default connect((state) => ({ isCollapsed: state.IsCollapsed }), {})(SideMenu)