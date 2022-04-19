import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    LeftSquareOutlined,
    RightSquareOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Menu, Dropdown, Layout, Avatar } from 'antd'
import { changecollapsed } from '../../../redux/action/actions'
import './index.css'
const { Header } = Layout
const roleName = '新闻咨询管理员'
const username = '三只晓筱'
function TopHeader(props) {
    const navigate = useNavigate()
    const menu = (
        <Menu className='ava_menu' >
            <Menu.Item key="1">{roleName}</Menu.Item>
            <Menu.Item
                key="2"
                onClick={() => {
                    localStorage.removeItem('token')
                    navigate('/login')
                }}
                danger
            >
                退出
            </Menu.Item>
        </Menu>
    )
    const changeCollapsed = () => {
        props.changecollapsed()
    }
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {props.isCollapsed ? (
                <RightSquareOutlined
                    className="menuunfold"
                    onClick={changeCollapsed}
                />
            ) : (
                <LeftSquareOutlined
                    className="menuunfold"
                    onClick={changeCollapsed}
                />
            )}
            <div className="right">
                <span className="welcome">欢迎 <b>{username}</b></span>
                &nbsp;&nbsp;
                <Dropdown overlay={menu}>
                    <Avatar className="avatar" alt="用户头像" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}

export default connect(
    (state) => ({
        isCollapsed: state.IsCollapsed,
    }),
    { changecollapsed }
)(TopHeader)
