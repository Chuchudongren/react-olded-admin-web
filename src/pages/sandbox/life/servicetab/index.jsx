import React, { useState, useEffect } from 'react'
import { Button, Tag, Input, Table, Modal, message, Form } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { PlusOutlined } from '@ant-design/icons'
// import './index.css'
export default function Lawdynamic() {
    const [dataSource, setdataSource] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})
    const [form_modal] = Form.useForm();


    useEffect(() => {
        axios.get('/admin/getServiceTabList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'servicelistid',
            width: '10%',
        },
        {
            title: '公司名称',
            dataIndex: 'conpany',
            width: '20%',
        },
        {
            title: '标签',
            dataIndex: 'tabs',
            width: '60%',
            render: (tabs, item) => (
                <>
                    {tabs.map((tag, index) => {
                        return (
                            <Tag closable onClose={() => onClose(tag, item.servicelistid)} key={index} color={'red'} >
                                {tag}
                            </Tag>
                        );
                    })}
                </>
            )
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <>
                        <Button
                            type='primary'
                            onClick={() => {
                                setIsModalVisible(true)
                                setCurrentItem(item)
                            }}
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </>
                )
            },
        },
    ]
    const handleOk = () => {
        const tabname = form_modal.getFieldsValue().tabname
        axios.post('/admin/addTabname', qs.stringify({ servicelistid: currentItem.servicelistid, tabname })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
        })
        currentItem.tabs.push(tabname)
        let newData = [...dataSource]
        newData.map(item => {
            if (item.servicelistid === currentItem.servicelistid) {
                item = currentItem
            }
            return item
        })
        setdataSource(newData)
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onClose = (tabname, servicelistid) => {
        axios.post('/admin/deleteServiceTab', qs.stringify({ tabname, servicelistid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
        })
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(item) => item.servicelistid}
                pagination={{
                    pageSize: 6,
                }}
            />
            <Modal width='800px' title="添加商家标签" cancelText='取消' okText='添加' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form_modal}>
                    <Form.Item label="公司名称">
                        {currentItem.conpany}
                    </Form.Item>
                    <Form.Item label="标签" name="tabname">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}
