import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Modal, Form, message, Select } from 'antd'
import axios from 'axios'
import qs from 'qs'
// import './index.css'
import {
    DeleteOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
const { confirm } = Modal
const { TextArea } = Input;
export default function Lawdynamic() {
    const [dataSource, setdataSource] = useState([])
    const [isModalVisible, setisModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})
    const [form_modal] = Form.useForm();


    useEffect(() => {
        axios.get('/admin/getLawdynamicList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'dynamicid',
            width: '10%',
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: '50%',
        },
        {
            title: '主题名称',
            dataIndex: 'themename',
            width: '20%',

        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <>
                        <Button
                            type='primary'
                            onClick={() => {
                                setisModalVisible(true)
                                setCurrentItem(item)
                                form_modal.setFieldsValue({ title: item.title, content: item.content, theme: item.theme + '' })
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
        setdataSource(dataSource.filter((data) => data.dynamicid !== item.dynamicid))
        axios.post('/admin/deleteLawdynamicById', qs.stringify({ dynamicid: item.dynamicid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        const title = form_modal.getFieldsValue().title
        const content = form_modal.getFieldsValue().content
        const theme = form_modal.getFieldsValue().theme
        const themename = theme === '0' ? '主题活动' : (theme === '1' ? '普法锦集' : '环球法治')

        if (Object.keys(currentItem).length === 0) {
            let newData = [...dataSource]
            axios.post('/admin/AddLawdynamic', qs.stringify({ title, content, theme })).then(res => {
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    newData.push({ dynamicid: res.data.dynamicid, title, content, theme, themename })
                    setdataSource(newData)
                }
            })
        } else {
            axios.post('/admin/UpdateLawdynamic', qs.stringify({ dynamicid: currentItem.dynamicid, title, content, theme })).then(res => {
                if (res.data.status === 200) message.success(res.data.message)
                axios.get('/admin/getLawdynamicList').then(res => {
                    if (res.data.status === 200) {
                        setdataSource(res.data.results)
                    }
                })
            })
        }
        setisModalVisible(false);
    };
    const handleCancel = () => {
        setisModalVisible(false);
    };

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(item) => item.dynamicid}
                pagination={{
                    pageSize: 6,
                }}
            />
            <Button
                style={{ width: '120px', height: '40px', fontSize: '20px', marginLeft: '50px', marginTop: '-50px' }}
                type='primary'
                onClick={() => {
                    setisModalVisible(true)
                    setCurrentItem({})
                    form_modal.setFieldsValue({ title: '', content: '', theme: '' })
                }}
            >添加用户</Button>
            <Modal width='800px' title="添加普法动态" cancelText='取消' okText={Object.keys(currentItem).length === 0 ? '发布' : '修改'} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form_modal}>
                    <Form.Item label="标题" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="内容" name="content">
                        <TextArea className="message_textArea" rows={7} showCount maxLength={1200} />
                    </Form.Item>
                    <Form.Item label="主题分类" name="theme">
                        <Select>
                            <Select.Option value="0">主题活动</Select.Option>
                            <Select.Option value="1">普法锦集</Select.Option>
                            <Select.Option value="2">环球法治</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}
