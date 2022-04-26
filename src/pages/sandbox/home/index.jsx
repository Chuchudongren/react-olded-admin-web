import React, { useEffect } from 'react'
import { Menu } from 'antd';
import qs from 'qs'
import { CustomerServiceOutlined, MedicineBoxOutlined, NotificationOutlined, SkinOutlined } from '@ant-design/icons';
import HomeLife from '../../../components/sandbox/home/life'
import HomeNews from '../../../components/sandbox/home/news'
import HomeHealth from '../../../components/sandbox/home/health'
import HomeHoard from '../../../components/sandbox/home/hoard'
import './index.css'

export default function Home() {
    const token = qs.parse(sessionStorage.getItem('token'))
    const [current, setCurrent] = React.useState('news');
    const onClick = (e) => {
        setCurrent(e.key);
    };
    useEffect(() => {
        if (token) {
            switch (token.roleid) {
                case '2':
                    setCurrent('news')
                    break;
                case '3':
                    setCurrent('life')
                    break;
                case '4':
                    setCurrent('health')
                    break;
                case '5':
                    setCurrent('hoard')
                    break;
                default:
                    break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="home_body">
            {
                token.roleid ?
                    token.roleid === '1' && <>
                        <Menu mode="horizontal" defaultSelectedKeys={['news']}>
                            <Menu.Item key="news" onClick={onClick} icon={<NotificationOutlined />}>
                                新闻资讯
                            </Menu.Item>
                            <Menu.Item key="life" onClick={onClick} icon={<SkinOutlined />}>
                                生活服务
                            </Menu.Item>
                            <Menu.Item key="health" onClick={onClick} icon={<MedicineBoxOutlined />}>
                                健康管理
                            </Menu.Item>
                            <Menu.Item key="hoard" onClick={onClick} icon={<CustomerServiceOutlined />}>
                                娱乐论坛
                            </Menu.Item>
                        </Menu>
                    </>
                    : <></>
            }
            {current === 'news' && <HomeNews />}
            {current === 'life' && <HomeLife />}
            {current === 'health' && <HomeHealth />}
            {current === 'hoard' && <HomeHoard />}
        </div>
    )
}
