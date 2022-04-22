import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Switch, message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { useNavigate } from 'react-router-dom'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import './index.css'
const { confirm } = Modal
export default function NewsList() {
    const navigate = useNavigate()
    const [dataSource, setdataSource] = useState([])
    const [filteredInfo, setfilteredInfo] = useState({})
    useEffect(() => {
        axios.get('/admin/getNewsList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'newsid',
            width: '10%',
            render: (newsid) => {
                return <b>{newsid}</b>
            },

        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            width: '50%',
            render: (title, item) => {
                return <a href={`/news/preview/${item.newsid}`}>{title}</a>
            },
        },
        {
            title: '分类',
            dataIndex: 'categoryname',
            width: '15%',
            filters: [
                { text: '国家政策', value: '国家政策' },
                { text: '城区新闻', value: '城区新闻' },
                { text: '社区新闻', value: '社区新闻' },
            ],
            filteredValue: filteredInfo.categoryname || null,
            onFilter: (categoryname, record) => record.categoryname.includes(categoryname),
            ellipsis: true,
        },
        {
            title: '热门',
            dataIndex: 'ishot',
            width: '9%',
            render: (ishot, item) => {
                return (
                    <Switch checked={ishot === 1} onChange={() => setHotNews(item)} />
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
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                navigate('/news/update/' + item.newsid)
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
        setdataSource(dataSource.filter((data) => data.newsid !== item.newsid))
        axios.post('/admin/deleteNewsByid', qs.stringify({ newsid: item.newsid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const setHotNews = (item) => {
        let newData = [...dataSource]
        newData.map(data => {
            if (data.newsid === item.newsid) {
                data.ishot = item.ishot === 1 ? 0 : 1
            }
            return data
        })
        console.log(item);
        axios.post('/admin/setHotNews', qs.stringify({ ...item })).then(res => {
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
                rowKey={(item) => item.newsid}
                onChange={handleChange}
                pagination={{
                    pageSize: 7,
                }}
            />
        </div>
    )
}
