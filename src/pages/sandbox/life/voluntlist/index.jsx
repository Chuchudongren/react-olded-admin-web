import React, { useState, useEffect } from 'react'
import { Button, Table, Form, Modal, Select, Switch, message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { useNavigate } from 'react-router-dom'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    SlidersOutlined
} from '@ant-design/icons'
// import './index.css'
const { confirm } = Modal
export default function VoluntList() {
    const navigate = useNavigate()
    const [dataSource, setdataSource] = useState([])
    const [filteredInfo, setfilteredInfo] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})
    const [form_modal] = Form.useForm();

    useEffect(() => {
        axios.get('/admin/getVoluntList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'voluntid',
            width: '10%',
            render: (voluntid) => {
                return <b>{voluntid}</b>
            },

        },
        {
            title: '活动标题',
            dataIndex: 'title',
            width: '40%',
            render: (title, item) => {
                return <a href={`/life/volunt/preview/${item.voluntid}`}>{title}</a>
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: '10%',
            render: (status) => {
                return status === 1 ? '进行中' : (status === 0 ? '未开始' : '已结束')
            },
        },
        {
            title: '分类',
            dataIndex: 'classification',
            width: '15%',
            filters: [
                { text: '社区服务', value: '社区服务' },
                { text: '文明风尚', value: '文明风尚' },
                { text: '卫生健康', value: '卫生健康' },
                { text: '关爱老人', value: '关爱老人' },
                { text: '关爱特殊群体', value: '关爱特殊群体' },
            ],
            filteredValue: filteredInfo.categoryname || null,
            onFilter: (categoryname, record) => record.categoryname.includes(categoryname),
            ellipsis: true,
        },
        {
            title: '热门',
            dataIndex: 'isrecommend',
            width: '9%',
            render: (ishot, item) => {
                return (
                    <Switch checked={ishot === 1} onChange={() => setHotVolunt(item)} />
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
                                navigate('/life/volunt/update/' + item.voluntid)
                            }}
                        />
                        &nbsp;&nbsp;
                        <Button
                            type='primary'
                            shape="circle"
                            icon={<SlidersOutlined />}
                            onClick={() => {
                                setCurrentItem(item)
                                setIsModalVisible(true)
                                form_modal.setFieldsValue({ status: '' + item.status })
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
        setdataSource(dataSource.filter((data) => data.voluntid !== item.voluntid))
        axios.post('/admin/deleteVoluntById', qs.stringify({ voluntid: item.voluntid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const setHotVolunt = (item) => {
        let newData = [...dataSource]
        newData.map(data => {
            if (data.voluntid === item.voluntid) {
                data.isrecommend = item.isrecommend === 1 ? 0 : 1
            }
            return data
        })
        axios.post('/admin/setHotVolunt', qs.stringify({ ...item })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
        setdataSource(newData)
    }
    const handleChange = (pagination, filters) => {
        setfilteredInfo(filters)
    }
    const handleOk = () => {
        const status = form_modal.getFieldsValue().status
        console.log(status);
        axios.post('/admin/setVoluntStatus', qs.stringify({ voluntid: currentItem.voluntid, status })).then(res => {
            if (res.data.status === 200) {
                message.success(res.data.message)
            }
        })
        let newData = [...dataSource]
        newData.map(data => {
            if (data.voluntid === currentItem.voluntid) {
                data.status = status
            }
            return data
        })
        setdataSource(newData)
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
                rowKey={(item) => item.voluntid}
                onChange={handleChange}
                pagination={{
                    pageSize: 7,
                }}
            />
            <Modal title="添加用户" cancelText='取消' okText='添加' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form_modal}
                >
                    <Form.Item label="状态" name="status">
                        <Select>
                            <Select.Option value="0">未开始</Select.Option>
                            <Select.Option value="1">进行中</Select.Option>
                            <Select.Option value="2">已结束</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}
