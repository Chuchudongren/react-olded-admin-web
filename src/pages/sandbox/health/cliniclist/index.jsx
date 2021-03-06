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
                        ??????
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        ??????
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
            title: '????????????',
            dataIndex: 'name',
            width: '40%',
        },
        {
            title: '??????',
            dataIndex: 'province',
            sorter: (a, b) => { return a.province > b.province ? a : b },
            width: '15%',
        },
        {
            title: '??????',
            dataIndex: 'city',
            width: '15%',
            ...getColumnSearchProps('city'),
        },
        {
            title: '????????????',
            dataIndex: 'tel',
            width: '15%',
        },
        {
            title: '??????',
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
            title: '???????????????????',
            icon: <ExclamationCircleOutlined />,
            okText: '??????',
            cancelText: '??????',
            onOk() {
                deleteMethod(item)
            },
            onCancel() { },
        })
    }
    //??????
    const deleteMethod = (item) => {
        // // ???????????????????????? + ????????????
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
            >??????</Button>
            <Modal width='800px' title="????????????" cancelText='??????' okText='??????' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form_modal}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="????????????"
                                name="name"
                                rules={[{ required: true, message: '?????????????????????!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="????????????"
                                name="tel"
                                rules={[{ required: true, message: '?????????????????????!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="??????"
                                name="province"
                                rules={[{ required: true, message: '???????????????!' }]}
                            >
                                <Select
                                    disabled={preview}
                                    placeholder="?????????"
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
                                label="??????"
                                name="city"
                                rules={[{ required: true, message: '???????????????!' }]}
                            >
                                <Select
                                    disabled={preview}
                                    placeholder="?????????"
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
                                label="????????????"
                                name="address"
                                rules={[{ required: true, message: '?????????????????????!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="????????????"
                                name="introduce"
                                rules={[{ required: true, message: '?????????????????????!' }]}
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
