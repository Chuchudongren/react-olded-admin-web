import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Space, Modal, Upload, Form, Row, Col, message, Select } from 'antd'
import axios from 'axios'
import qs from 'qs'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
const { confirm } = Modal
export default function MessageList() {
    const [dataSource, setdataSource] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({});

    const [form_modal] = Form.useForm();
    useEffect(() => {
        axios.get('/admin/getHoardCateList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'hoardcateid',
            width: '20%',
        },
        {
            title: '论坛分类',
            dataIndex: 'hoardcate',
            width: '60%',
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <>
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
                                setCurrentItem(item)
                                setIsModalVisible(true)
                                form_modal.setFieldsValue(item)
                            }}
                        />
                    </>
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
        setdataSource(dataSource.filter((data) => data.hoardcateid !== item.hoardcateid))
        axios.post('/admin/deleteHoardCateById', qs.stringify({ hoardcateid: item.hoardcateid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        const formdata = form_modal.getFieldsValue()
        if (Object.keys(currentItem).length === 0) {
            let newData = [...dataSource]
            axios.post('/admin/addHoardCate', qs.stringify({ ...formdata })).then(res => {
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    newData.push({ hoardcateid: res.data.hoardcateid, ...formdata })
                    setdataSource(newData)
                }
            })
        } else {
            axios.post('/admin/updateHoardCate', qs.stringify({ hoardcateid: currentItem.hoardcateid, ...formdata })).then(res => {
                if (res.data.status === 200) message.success(res.data.message)
                axios.get('/admin/getHoardCateList').then(res => {
                    if (res.data.status === 200) {
                        setdataSource(res.data.results)
                    }
                })
            })
        }
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
                rowKey={(item) => item.hoardcateid}
                pagination={{
                    pageSize: 6,
                }}
            />
            <Button
                style={{ width: '120px', height: '40px', fontSize: '20px', marginLeft: '50px', marginTop: '-50px' }}
                type='primary'
                onClick={() => {
                    let resetObj = {
                        hospitaladdress: '',
                    }
                    form_modal.setFieldsValue(resetObj)
                    setIsModalVisible(true)
                }}
            >添加</Button>
            <Modal title="添加论坛分类" cancelText='取消' okText='添加' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form_modal}>
                    <Form.Item
                        label="论坛分类"
                        name="hoardcate"
                        rules={[{ required: true, message: '请输入论坛分类!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}
