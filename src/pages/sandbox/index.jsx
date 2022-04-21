import React, { useEffect } from 'react'
import { Layout } from 'antd';
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import SideMenu from '../../components/sandbox/sidemenu'
import TopHeader from '../../components/sandbox/topheader'
import SandboxRouter from '../../router/sandboxRouter'
import './index.css'

const { Content } = Layout
export default function SandBox() {
    Nprogress.start()
    useEffect(() => {
        Nprogress.done()
    })

    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content className="site-layout-background">
                    <SandboxRouter />
                </Content>
            </Layout>
        </Layout>
    )
}
