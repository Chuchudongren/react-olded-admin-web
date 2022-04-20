import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Modal, Switch, Button, Form, message, Typography } from 'antd';
import axios from 'axios'
import qs from 'qs'
import './index.css'
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
            <Select.Option value="超级管理员">超级管理员</Select.Option>
            <Select.Option value="新闻资讯管理员">新闻资讯管理员</Select.Option>
            <Select.Option value="生活服务管理员">生活服务管理员</Select.Option>
            <Select.Option value="健康管理管理员">健康管理管理员</Select.Option>
            <Select.Option value="论坛管理员">论坛管理员</Select.Option>
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
    const [form_modal] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        axios.get('/admin/user').then(res => {
            setData(res.data.results)
        })
    }, [])

    const isEditing = (record) => record.username === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            username: '',
            password: '',
            rolename: '',
            ...record,
        });
        setEditingKey(record.username);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (username) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => username === item.username);
            if (index > -1) {
                const item = newData[index];
                axios.post('/admin/changeRoleById', qs.stringify({ ...row, adminid: item.adminid }))
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
            title: '用户名',
            dataIndex: 'username',
            width: '25%',
            editable: true,
        },
        {
            title: '密码',
            dataIndex: 'password',
            width: '15%',
            editable: true,
        },
        {
            title: '权限',
            dataIndex: 'rolename',
            width: '40%',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.username)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            保存
                        </Typography.Link>
                        <Typography.Link onClick={cancel}>
                            取消
                        </Typography.Link>
                    </span>
                ) : (
                    record.username !== 'admin' ?
                        <>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                编辑
                            </Typography.Link>
                            &nbsp;
                            <Switch checked={record.state === 0} onChange={() => disabledUser(record)} />
                        </> :
                        <>
                            <Button style={{ width: '120px', height: '40px', fontSize: '20px' }} onClick={() => { showModal() }}>添加用户</Button>
                        </>


                );
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
                inputType: col.dataIndex === 'rolename' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const disabledUser = (record) => {
        const newData = [...data];
        newData.map(item => {
            if (item.username === record.username) {
                item.state = item.state === 1 ? 0 : 1
            }
            return item
        })
        axios.post('/admin/disabledUser', qs.stringify({ state: record.state, adminid: record.adminid }))
        setData(newData);
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const datas = form_modal.getFieldsValue();
        axios.post('/admin/addAdmin', qs.stringify({ ...datas })).then(res => {
            if (res.data.status === 200) {
                message.success(res.data.message)
                const newData = [...data];
                newData.push({ ...res.data.newData })
                setData(newData)
            } else {
                message.info(res.data.message)
            }
        })
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
                    rowKey={item => item.adminid}
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                        pageSize: 7
                    }}
                />
            </Form>
            <Modal title="添加用户" cancelText='取消' okText='添加' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form_modal}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    initialValues={{
                        size: 'default',
                    }}
                >
                    <Form.Item label="用户名" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item label="密码" name="password">
                        <Input />
                    </Form.Item>
                    <Form.Item label="权限" name="rolename">
                        <Select>
                            <Select.Option value="超级管理员">超级管理员</Select.Option>
                            <Select.Option value="新闻资讯管理员">新闻资讯管理员</Select.Option>
                            <Select.Option value="生活服务管理员">生活服务管理员</Select.Option>
                            <Select.Option value="健康管理管理员">健康管理管理员</Select.Option>
                            <Select.Option value="论坛管理员">论坛管理员</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
