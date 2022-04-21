import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'
import './index.css'
import LoginParticles from '../../components/login/particles'
export default function Login(props) {
    const navigate = useNavigate()
    const onFinish = (data) => {
        axios.post('/admin/login', qs.stringify({ username: data.username, password: data.password })).then(res => {
            if (res.data.status === 200) {
                message.success(res.data.message)
                localStorage.setItem('token', qs.stringify(res.data.token))
                navigate('/')
            } else message.info(res.data.message)
        })
    }
    return (
        <div className="loginBox">
            <LoginParticles />
            <div className="formContainer">
                <div className="loginTitle">老来乐后台管理系统</div>
                <Form name="normal_login" className="login-form" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的用户名!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="用户名"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入你的密码!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            style={{ width: '120px', height: '40px', fontSize: '24px', lineHeight: '1em' }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
