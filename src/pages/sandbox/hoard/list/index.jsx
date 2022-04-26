import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Switch, message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { useNavigate } from 'react-router-dom'
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    SlidersOutlined
} from '@ant-design/icons'
const { confirm } = Modal
export default function VoluntList() {
    const navigate = useNavigate()
    const [dataSource, setdataSource] = useState([])
    const [hoardCateList, setHoardCateList] = useState([])
    const [filteredInfo, setfilteredInfo] = useState({})

    useEffect(() => {
        axios.get('/admin/getTopicList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
        axios.get('/admin/getHoardCateList').then(res => {
            if (res.data.status === 200) {
                let cateList = res.data.results
                let cateFilters = []
                cateList.map(item => {
                    let cateitem = { text: item.hoardcate, value: item.hoardcate }
                    cateFilters.push(cateitem)
                    return item
                })
                setHoardCateList(cateFilters)
            }
        })
    }, [])
    const columns = [
        {
            title: '话题ID',
            dataIndex: 'topicid',
            width: '10%',
            render: (topicid) => {
                return <b>{topicid}</b>
            },

        },
        {
            title: '用户ID',
            dataIndex: 'userid',
            width: '10%',
            render: (topicid) => {
                return <b>{topicid}</b>
            },

        },
        {
            title: '话题标题',
            dataIndex: 'title',
            width: '40%',
        },
        {
            title: '分类',
            dataIndex: 'hoardcate',
            width: '15%',
            filters: hoardCateList,
            filteredValue: filteredInfo.hoardcate || null,
            onFilter: (hoardcate, record) => record.hoardcate.includes(hoardcate),
            ellipsis: true,
        },
        {
            title: '热门',
            dataIndex: 'ishot',
            width: '9%',
            render: (ishot, item) => {
                return (
                    <Switch checked={ishot === 1} onChange={() => setHotTopic(item)} />
                )
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button
                            danger
                            onClick={() => {
                                confirmMethod(item)
                            }}
                            shape="circle"
                            icon={<DeleteOutlined />}
                        />
                        &nbsp;&nbsp;
                        <Button
                            type='primary'
                            shape="circle"
                            icon={<SlidersOutlined />}
                            onClick={() => {
                                navigate('/hoard/check/' + item.topicid)
                            }}
                        />
                    </div>
                )
            },
        },
    ]
    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                deleteMethod(item)
            },
            onCancel() { },
        })
    }
    //删除
    const deleteMethod = (item) => {
        // // 当前页面同步状态 + 后端同步
        setdataSource(dataSource.filter((data) => data.topicid !== item.topicid))
        axios.post('/admin/deleteTopic', qs.stringify({ topicid: item.topicid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const setHotTopic = (item) => {
        let newData = [...dataSource]
        newData.map(data => {
            if (data.topicid === item.topicid) {
                data.ishot = item.ishot === 1 ? 0 : 1
            }
            return data
        })
        axios.post('/admin/setTopicIsHot', qs.stringify({ ...item })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
        setdataSource(newData)
    }
    const handleChange = (pagination, filters) => {
        setfilteredInfo(filters)
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(item) => item.topicid}
                onChange={handleChange}
                pagination={{
                    pageSize: 7,
                }}
            />
        </div >
    )
}
