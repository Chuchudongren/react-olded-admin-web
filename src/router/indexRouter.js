import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/login'
import SandBox from '../pages/sandbox'
import Blank from '../pages/blank'
export default function IndexRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/blank" element={<Blank />} />
            <Route
                path="/*"
                element={<SandBox />}
            />
            <Route path="*" element={<Blank />} />
        </Routes>
    )
}
