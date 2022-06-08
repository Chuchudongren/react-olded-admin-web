import React, { useState, useEffect } from 'react'
import { Button, Table, Descriptions, Modal, Switch, message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { useNavigate } from 'react-router-dom'
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
const { confirm } = Modal
export default function NewsList() {
    const navigate = useNavigate()
    const [dataSource, setdataSource] = useState([])
    const [filteredInfo, setfilteredInfo] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})
    useEffect(() => {
        axios.get('/admin/getHealthMsg').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: '咨询标题',
            dataIndex: 'title',
            width: '44%',
        },
        {
            title: '分类',
            dataIndex: 'grade',
            width: '15%',
            filters: [
                { text: '健康常识', value: '健康常识' },
                { text: '热点', value: '热点' },
                { text: '膳食知识', value: '膳食知识' },
            ],
            filteredValue: filteredInfo.grade || null,
            onFilter: (grade, record) => record.grade.includes(grade),
            ellipsis: true,
        },
        {
            title: '日期',
            dataIndex: 'pushtime',
            width: '14%',
            render: (pushtime) => {
                let newPush = pushtime.split(' ')[0]
                return newPush
            }
        },
        {
            title: '热门',
            dataIndex: 'isshow',
            width: '9%',
            render: (isshow, item) => {
                return (
                    <Switch checked={isshow === 1} onChange={() => setIsShow(item)} />
                )
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button
                            type='primary'
                            onClick={() => {
                                setIsModalVisible(true)
                                setCurrentItem(item)
                            }}
                            shape="circle"
                            icon={<EyeOutlined />}
                        />
                        &nbsp;&nbsp;
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
                                navigate('/health/msg/update/' + item.healthmsgid)
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
        setdataSource(dataSource.filter((data) => data.healthmsgid !== item.healthmsgid))
        axios.post('/admin/deleteHealthMsg', qs.stringify({ healthmsgid: item.healthmsgid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const setIsShow = (item) => {
        let newData = [...dataSource]
        newData.map(data => {
            if (data.healthmsgid === item.healthmsgid) {
                data.isshow = item.isshow === 1 ? 0 : 1
            }
            return data
        })
        axios.post('/admin/setHealthMsgIsShow', qs.stringify({ ...item })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
        setdataSource(newData)
    }
    const handleChange = (pagination, filters) => {
        setfilteredInfo(filters)
    }
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(item) => item.healthmsgid}
                onChange={handleChange}
                pagination={{
                    pageSize: 7,
                }}
            />
            <Modal title="查看" width={'1200px'} cancelText='取消' okText='确定' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions column={1}>
                    <Descriptions.Item label="标题">
                        {currentItem.title}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions column={2}>
                    <Descriptions.Item label="发布时间">
                        {currentItem.pushtime}
                    </Descriptions.Item>
                    <Descriptions.Item label="分类">
                        {currentItem.grade}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions column={1}>
                    <Descriptions.Item label="简介">
                        {currentItem.intro}
                    </Descriptions.Item>
                    <Descriptions.Item label="内容">
                        <div dangerouslySetInnerHTML={{ __html: currentItem.content }}></div>
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    )
}
