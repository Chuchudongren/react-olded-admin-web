import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Modal, Descriptions, Button, Form, message, Typography } from 'antd';
import axios from 'axios'
import { EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import qs from 'qs'
const { confirm } = Modal
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'select' ?
        <Select>
            <Select.Option value="未开始">未开始</Select.Option>
            <Select.Option value="进行中">进行中</Select.Option>
            <Select.Option value="已完成">已完成</Select.Option>
        </Select>
        : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function UserList() {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})
    useEffect(() => {
        axios.get('/admin/getClinicRecord').then(res => {
            setData(res.data.results)
        })
    }, [])

    const isEditing = (record) => record.clinicrecord === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            clinicrecord: '',
            userid: '',
            name: '',
            status: '',
            ...record,
        });
        setEditingKey(record.clinicrecord);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (clinicrecord) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => clinicrecord === item.clinicrecord);
            if (index > -1) {
                const item = newData[index];
                axios.post('/admin/updateClinicRecord', qs.stringify({ ...row, clinicrecord: item.clinicrecord })).then(res => {
                    if (res.data.status === 200) message.success(res.data.message)
                })
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('失败：', errInfo);
        }
    };

    const columns = [
        {
            title: '订单ID',
            dataIndex: 'clinicrecord',
            width: '10%',
            editable: false,
        },
        {
            title: '用户ID',
            dataIndex: 'userid',
            width: '10%',
            editable: false,
        },
        {
            title: '诊所名称',
            dataIndex: 'name',
            width: '40%',
            editable: false,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: '20%',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <>
                        {editable ? (
                            <span>
                                <Typography.Link
                                    onClick={() => save(record.clinicrecord)}
                                    style={{
                                        marginRight: 8,
                                    }}
                                >
                                    保存
                                </Typography.Link>
                                <Typography.Link onClick={cancel}>
                                    取消
                                </Typography.Link>
                                &nbsp;
                            </span>
                        ) : (
                            <>
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    编辑
                                </Typography.Link>
                                &nbsp;
                            </>
                        )}
                        <Button
                            type='primary'
                            onClick={() => {
                                setIsModalVisible(true)
                                setCurrentItem(record)
                            }}
                            shape="circle"
                            icon={<EyeOutlined />}
                        />
                        &nbsp;&nbsp;
                        <Button
                            danger
                            onClick={() => {
                                confirmMethod(record)
                            }}
                            shape="circle"
                            icon={<DeleteOutlined />}
                        />
                    </>
                )
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'status' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
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
        setData(data.filter((data) => data.clinicrecord !== item.clinicrecord))
        axios.post('/admin/deleteClinicRecord', qs.stringify({ clinicrecord: item.clinicrecord })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    rowKey={item => item.clinicrecord}
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                        pageSize: 7
                    }}
                />
            </Form>
            <Modal title="预约记录" width={'1200px'} cancelText='取消' okText='确定' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions column={3}>
                    <Descriptions.Item label="预约id">
                        {currentItem.clinicrecord}
                    </Descriptions.Item>
                    <Descriptions.Item label="用户id">
                        {currentItem.userid}
                    </Descriptions.Item>
                    <Descriptions.Item label="联系电话">
                        {currentItem.tel}
                    </Descriptions.Item>
                    <Descriptions.Item label="诊所id">
                        {currentItem.clinicid}
                    </Descriptions.Item>
                    <Descriptions.Item label="省份">
                        {currentItem.province}
                    </Descriptions.Item>
                    <Descriptions.Item label="城市">
                        {currentItem.city}
                    </Descriptions.Item>
                    <Descriptions.Item label="预约日期">
                        {currentItem.treatmentdate}
                    </Descriptions.Item>
                    <Descriptions.Item label="预约时间段">
                        {currentItem.timeslot}
                    </Descriptions.Item>
                    <Descriptions.Item label="发布时间">
                        {currentItem.pushtime}
                    </Descriptions.Item>
                    <Descriptions.Item label="完成时间">
                        {currentItem.finishtime}
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                        {currentItem.status}
                    </Descriptions.Item>
                    <Descriptions.Item label="诊所电话">
                        {currentItem.clinictel}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions column={1}>
                    <Descriptions.Item label="诊所名称">
                        {currentItem.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="详细地址">
                        {currentItem.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="描述">
                        {currentItem.represent}
                    </Descriptions.Item>
                    <Descriptions.Item label="详细内容">
                        {currentItem.detail}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
}
