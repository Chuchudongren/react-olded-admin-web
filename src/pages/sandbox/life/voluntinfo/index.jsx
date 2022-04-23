import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, message, Descriptions } from 'antd'
import axios from 'axios'
import qs from 'qs'
import {
    DeleteOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
const { confirm } = Modal
export default function VoluntList() {
    const [dataSource, setdataSource] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})


    useEffect(() => {
        axios.get('/admin/getVoluntUserList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: '用户ID',
            dataIndex: 'userid',
            width: '25%',
        },
        {
            title: '用户昵称',
            dataIndex: 'nickname',
            width: '30%',
        },
        {
            title: '审核状态',
            dataIndex: 'isvolunt',
            width: '25%',
            render: (isvolunt) => {
                return isvolunt === 1 ? '已通过' : '待审核'
            },
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    item.isvolunt === 1 ?

                        <Button
                            danger
                            onClick={() => {
                                confirmMethod(item)
                            }}
                            shape="circle"
                            icon={<DeleteOutlined />}
                        />
                        : <>
                            <Button
                                type='primary'
                                onClick={() => {
                                    setCurrentItem(item)
                                    setIsModalVisible(true)
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
        setdataSource(dataSource.filter((data) => data.voluntinfoid !== item.voluntinfoid))
        axios.post('/admin/deleteVoluntUserByUserid', qs.stringify({ voluntinfoid: item.voluntinfoid, userid: item.userid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        axios.post('/admin/setUserIsvolunt', qs.stringify({ userid: currentItem.userid }))
        let newData = [...dataSource]
        newData.map(data => {
            if (data.userid === currentItem.userid) {
                data.isvolunt = 1
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
                pagination={{
                    pageSize: 7,
                }}
            />
            <Modal width='800px' title="志愿者信息" cancelText='取消' okText='通过' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions column={3}>
                    <Descriptions.Item label="用户id">
                        {currentItem.userid}
                    </Descriptions.Item>
                    <Descriptions.Item label="用户昵称">
                        {currentItem.nickname}
                    </Descriptions.Item>
                    <Descriptions.Item label="真实姓名">
                        {currentItem.realname}
                    </Descriptions.Item>
                    <Descriptions.Item label="性别">
                        {currentItem.gender}
                    </Descriptions.Item>
                    <Descriptions.Item label="志愿者类型">
                        {currentItem.volunttype}
                    </Descriptions.Item>
                    <Descriptions.Item label="学历">
                        {currentItem.education}
                    </Descriptions.Item>
                    <Descriptions.Item label="政治面貌">
                        {currentItem.politicalstatus}
                    </Descriptions.Item>
                    <Descriptions.Item label="民族">
                        {currentItem.nationality}
                    </Descriptions.Item>
                    <Descriptions.Item label="职业">
                        {currentItem.employment}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions column={2}>
                    <Descriptions.Item label="身份证号">
                        {currentItem.idnumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="电话">
                        {currentItem.tel}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions column={1}>
                    <Descriptions.Item label="地址">
                        {currentItem.residence0}，{currentItem.residence1}，{currentItem.residence2}
                    </Descriptions.Item>
                    <Descriptions.Item label="特长">
                        {currentItem.specialty}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    )
}
