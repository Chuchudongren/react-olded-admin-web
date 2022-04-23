import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Modal, Form, message, Descriptions } from 'antd'
import axios from 'axios'
import qs from 'qs'
import UploadComponent from '../../../../components/sandbox/upload'
import './index.css'
import {
    DeleteOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
const { confirm } = Modal
const { TextArea } = Input;
export default function MessageList() {
    const [dataSource, setdataSource] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})
    const [replyRead, setReplyRead] = useState('')
    const [form_modal] = Form.useForm();


    useEffect(() => {
        axios.get('/admin/getMessageList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: '资讯ID',
            dataIndex: 'messageid',
            width: '10%',
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: '40%',
        },
        {
            title: '提问时间',
            dataIndex: 'questiontime',
            width: '20%',

        },
        {
            title: '回复状态',
            dataIndex: 'isreply',
            width: '15%',
            sorter: (a, b) => a.isreply - b.isreply,
            render: (isreply) => {
                return isreply === 1 ? '已回复' : '待回复'
            },
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <>
                        <Button
                            type='primary'
                            onClick={() => {
                                setCurrentItem(item)
                                setIsModalVisible(true)
                                setReplyRead(item.read)
                                form_modal.setFieldsValue({ reply: item.reply })
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
        setdataSource(dataSource.filter((data) => data.messageid !== item.messageid))
        axios.post('/admin/deleteMessageById', qs.stringify({ messageid: item.messageid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        const token = qs.parse(sessionStorage.getItem('token'))
        let reply = form_modal.getFieldsValue().reply
        axios.post('/admin/setUserMessage', qs.stringify({ messageid: currentItem.messageid, reply, read: replyRead, adminid: token.username })).then(res => {
            if (res.data.status === 200) { message.success(res.data.message) }
        })
        let newData = [...dataSource]
        newData.map(data => {
            if (data.messageid === currentItem.messageid) {
                data.reply = reply
                data.isreply = 1
            }
            return data
        })
        setdataSource(newData)
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const getRead = (url) => {
        setReplyRead(url)
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(item) => item.messageid}
                pagination={{
                    pageSize: 6,
                }}
            />
            <Modal width='800px' title="法律咨询" cancelText='取消' okText='确定' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions column={3}>
                    <Descriptions.Item label="用户id">
                        {currentItem.userid}
                    </Descriptions.Item>
                    <Descriptions.Item label="联系方式">
                        {currentItem.tel}
                    </Descriptions.Item>
                    <Descriptions.Item label="真实名称">
                        {currentItem.realname}
                    </Descriptions.Item>
                    <Descriptions.Item label="工作">
                        {currentItem.job}
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                        {currentItem.Email}
                    </Descriptions.Item>
                    <Descriptions.Item label="提问时间">
                        {currentItem.questiontime}
                    </Descriptions.Item>
                    <Descriptions.Item label="省份">
                        {currentItem.province}
                    </Descriptions.Item>
                    <Descriptions.Item label="城市">
                        {currentItem.city}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions column={1}>
                    <Descriptions.Item label="详细地址">
                        {currentItem.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="标题">
                        {currentItem.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="内容">
                        {currentItem.content}
                    </Descriptions.Item>
                </Descriptions>
                <Form form={form_modal}>
                    <Form.Item label="回复" name="reply">
                        <TextArea className="message_textArea" rows={4} showCount maxLength={300} />
                    </Form.Item>
                    <div key={currentItem.messageid}>
                        <span className="pic_text">上传朗读语音</span>&nbsp;&nbsp;
                        <UploadComponent getFuc={getRead} action={'/uploadRead'} />
                    </div>
                </Form>
            </Modal>
        </div >
    )
}
