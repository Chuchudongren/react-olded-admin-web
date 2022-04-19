import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/sandbox/home'
import UserList from '../pages/sandbox/user/userLIst'
import News from '../pages/sandbox/news'
import Life from '../pages/sandbox/life'
import Health from '../pages/sandbox/health'
import Hoard from '../pages/sandbox/hoard'
export default function SandboxRouter() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/news" element={<News />} />
            <Route path="/life" element={<Life />} />
            <Route path="/health" element={<Health />} />
            <Route path="/hoard" element={<Hoard />} />
        </Routes>
    )
}
