import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/sandbox/home'
import User from '../pages/sandbox/user'
import NewsList from '../pages/sandbox/news/list'
import NewsAdd from '../pages/sandbox/news/add'
import NewsPreview from '../pages/sandbox/news/preview'
import NewsUpdate from '../pages/sandbox/news/update'
import Lawdynamic from '../pages/sandbox/life/lawdynamic'
import Messagelist from '../pages/sandbox/life/messagelist'
import Servicelist from '../pages/sandbox/life/servicelist'
import Servicetab from '../pages/sandbox/life/servicetab'
import Voluntadd from '../pages/sandbox/life/voluntadd'
import VoluntUpdate from '../pages/sandbox/life/voluntupdate'
import VoluntPreview from '../pages/sandbox/life/voluntpreview'
import Voluntinfo from '../pages/sandbox/life/voluntinfo'
import Voluntlist from '../pages/sandbox/life/voluntlist'
import Cliniclist from '../pages/sandbox/health/cliniclist'
import Clinicrecord from '../pages/sandbox/health/clinicrecord'
import Hospital from '../pages/sandbox/health/hospital'
import Msgadd from '../pages/sandbox/health/msgadd'
import Msglist from '../pages/sandbox/health/msglist'
import MsgUpdate from '../pages/sandbox/health/msgupdate'
import HoardCate from '../pages/sandbox/hoard/cate'
import HoardCheck from '../pages/sandbox/hoard/check'
import HoardList from '../pages/sandbox/hoard/list'
export default function SandboxRouter() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/news/list" element={<NewsList />} />
            <Route path="/news/add" element={<NewsAdd />} />
            <Route path="/news/preview/:newsid" element={<NewsPreview />} />
            <Route path="/news/update/:newsid" element={<NewsUpdate />} />
            <Route path="/life/volunt/list" element={<Voluntlist />} />
            <Route path="/life/volunt/add" element={<Voluntadd />} />
            <Route path="/life/volunt/update/:voluntid" element={<VoluntUpdate />} />
            <Route path="/life/volunt/preview/:voluntid" element={<VoluntPreview />} />
            <Route path="/life/volunt/info" element={<Voluntinfo />} />
            <Route path="/life/message/list" element={<Messagelist />} />
            <Route path="/life/lawdynamic" element={<Lawdynamic />} />
            <Route path="/life/service/list" element={<Servicelist />} />
            <Route path="/life/service/tab" element={<Servicetab />} />
            <Route path="/health/clinic/list" element={<Cliniclist />} />
            <Route path="/health/clinic/record" element={<Clinicrecord />} />
            <Route path="/health/hospital" element={<Hospital />} />
            <Route path="/health/msg/add" element={<Msgadd />} />
            <Route path="/health/msg/list" element={<Msglist />} />
            <Route path="/health/msg/update/:healthmsgid" element={<MsgUpdate />} />
            <Route path="/hoard/cate" element={<HoardCate />} />
            <Route path="/hoard/check/:topicid" element={<HoardCheck />} />
            <Route path="/hoard/list" element={<HoardList />} />
            <Route path="/" element={<Home />} />
        </Routes>
    )
}
