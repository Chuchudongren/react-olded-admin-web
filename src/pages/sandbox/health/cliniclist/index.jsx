import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Space, Modal, Form, Row, Col, message, Select } from 'antd'
import axios from 'axios'
import Highlighter from 'react-highlight-words';
import qs from 'qs'
import { province } from '../../../pro'
import {
    SearchOutlined,
    DeleteOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
} from '@ant-design/icons'
const { confirm } = Modal
const { TextArea } = Input;
export default function MessageList() {
    const [dataSource, setdataSource] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({})
    const [preview, setPreview] = useState(false)

    const [form_modal] = Form.useForm();
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const [city, setCity] = useState([])

    let searchInput

    useEffect(() => {
        axios.get('/admin/getClinic').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        重置
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: '诊所名称',
            dataIndex: 'name',
            width: '40%',
        },
        {
            title: '省份',
            dataIndex: 'province',
            sorter: (a, b) => { return a.province > b.province ? a : b },
            width: '15%',
        },
        {
            title: '城市',
            dataIndex: 'city',
            width: '15%',
            ...getColumnSearchProps('city'),
        },
        {
            title: '联系电话',
            dataIndex: 'tel',
            width: '15%',
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
                                form_modal.setFieldsValue(item)
                                setPreview(true)
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
                                setCurrentItem(item)
                                setPreview(false)
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
        setdataSource(dataSource.filter((data) => data.clinicid !== item.clinicid))
        axios.post('/admin/deleteClinic', qs.stringify({ clinicid: item.clinicid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        const formdata = form_modal.getFieldsValue()
        if (Object.keys(currentItem).length === 0 && !preview) {
            let newData = [...dataSource]
            axios.post('/admin/addClinic', qs.stringify({ ...formdata })).then(res => {
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    newData.push({ clinicid: res.data.clinicid, ...formdata })
                    setdataSource(newData)
                }
            })
        } else if (!preview) {
            axios.post('/admin/updateClinic', qs.stringify({ clinicid: currentItem.clinicid, ...formdata })).then(res => {
                if (res.data.status === 200) message.success(res.data.message)
                axios.get('/admin/getClinic').then(res => {
                    if (res.data.status === 200) {
                        setdataSource(res.data.results)
                    }
                })
            })
        }
        setPreview(false)
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setPreview(false)
    };
    const onProvinceChange = (value) => {
        form_modal.setFieldsValue({
            city: '',
        });
        let currentPro = province.filter(item => item.name === value)[0].city
        setCity(currentPro)
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(item) => item.clinicid}
                pagination={{
                    pageSize: 6,
                }}
            />
            <Button
                style={{ width: '120px', height: '40px', fontSize: '20px', marginLeft: '50px', marginTop: '-50px' }}
                type='primary'
                onClick={() => {
                    let resetObj = {
                        address: '',
                        name: '',
                        introduce: '',
                        province: '',
                        city: '',
                        tel: '',
                        website: '',
                    }
                    form_modal.setFieldsValue(resetObj)
                    setCurrentItem({})
                    setIsModalVisible(true)
                }}
            >添加</Button>
            <Modal width='800px' title="诊所信息" cancelText='取消' okText='确定' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form_modal}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="诊所名称"
                                name="name"
                                rules={[{ required: true, message: '请输入诊所名称!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="联系方式"
                                name="tel"
                                rules={[{ required: true, message: '请输入联系方式!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="省份"
                                name="province"
                                rules={[{ required: true, message: '请选择省份!' }]}
                            >
                                <Select
                                    disabled={preview}
                                    placeholder="请选择"
                                    onChange={onProvinceChange}
                                >
                                    {
                                        province.map(item =>
                                            <Select.Option style={{ width: '200px' }} key={item.name} value={item.name}>{item.name}</Select.Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="城市"
                                name="city"
                                rules={[{ required: true, message: '请选择城市!' }]}
                            >
                                <Select
                                    disabled={preview}
                                    placeholder="请选择"
                                >
                                    {
                                        city.map(item =>
                                            <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="诊所地址"
                                name="address"
                                rules={[{ required: true, message: '请输入诊所地址!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="诊所介绍"
                                name="introduce"
                                rules={[{ required: true, message: '请输入诊所介绍!' }]}
                            >
                                <TextArea disabled={preview} className="message_textArea" rows={5} showCount maxLength={300} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div >
    )
}
