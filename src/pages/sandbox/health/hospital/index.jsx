import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Space, Modal, Upload, Form, Row, Col, message, Select } from 'antd'
import axios from 'axios'
import Highlighter from 'react-highlight-words';
import qs from 'qs'
import { province } from '../../../pro'
import {
    LoadingOutlined,
    PlusOutlined,
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
    const [loading, setLoading] = useState(false)
    const [loadingCode, setLoadingCode] = useState(false)

    const [currentItem, setCurrentItem] = useState({})
    const [preview, setPreview] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [imageUrlCode, setImageUrlCode] = useState('')

    const [form_modal] = Form.useForm();
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const [city, setCity] = useState([])

    let searchInput

    useEffect(() => {
        axios.get('/admin/getHospitalList').then(res => {
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
            dataIndex: 'hospitalname',
            width: '50%',
        },
        {
            title: '??????',
            dataIndex: 'province',
            width: '15%',
        },
        {
            title: '??????',
            dataIndex: 'city',
            width: '15%',
            ...getColumnSearchProps('city'),
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
                                setImageUrl(item.pic)
                                setImageUrlCode(item.twoDcode)
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
                                setImageUrl(item.pic)
                                setImageUrlCode(item.twoDcode)
                            }}
                        />
                    </>
                )
            },
        },
    ]
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('???????????????JPG/PNG???????????????!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('??????????????????2MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    const handleChangeUpload = info => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false)
            setImageUrl(info.file.response.url)
        };
    }
    const handleChangeUploadCode = info => {
        if (info.file.status === 'uploading') {
            setLoadingCode(true)
            return;
        }
        if (info.file.status === 'done') {
            setLoadingCode(false)
            setImageUrlCode(info.file.response.url)
        };
    }

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
        setdataSource(dataSource.filter((data) => data.hospitallistid !== item.hospitallistid))
        axios.post('/admin/deleteHospital', qs.stringify({ hospitallistid: item.hospitallistid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        const formdata = form_modal.getFieldsValue()
        if (Object.keys(currentItem).length === 0 && !preview) {
            let newData = [...dataSource]
            axios.post('/admin/addHospital', qs.stringify({ ...formdata, pic: imageUrl, twoDcode: imageUrlCode })).then(res => {
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    newData.push({ hospitallistid: res.data.hospitallistid, ...formdata, pic: imageUrl, twoDcode: imageUrlCode })
                    setdataSource(newData)
                }
            })
        } else if (!preview) {
            axios.post('/admin/UpdateHospital', qs.stringify({ hospitallistid: currentItem.hospitallistid, ...formdata, pic: imageUrl, twoDcode: imageUrlCode })).then(res => {
                if (res.data.status === 200) message.success(res.data.message)
                axios.get('/admin/getHospitalList').then(res => {
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
                rowKey={(item) => item.hospitallistid}
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
                        hospitalname: '',
                        introduce: '',
                        province: '',
                        city: '',
                        tel: '',
                        website: '',
                    }
                    setImageUrl('')
                    setImageUrlCode('')
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
                                name="hospitalname"
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
                                name="hospitaladdress"
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
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="????????????"
                                name="website"
                                rules={[{ required: true, message: '?????????????????????!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Upload
                                disabled={preview}
                                name="uploadPic"
                                listType="picture-card"
                                className="pic-uploader"
                                showUploadList={false}
                                action="/uploadPic"
                                beforeUpload={beforeUpload}
                                onChange={handleChangeUpload}
                            >
                                {imageUrl ? <img className='change_avatar' src={imageUrl} alt="imageUrl" style={{ width: '100%' }} /> : <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>??????</div>
                                </div>}
                            </Upload>
                        </Col>
                        <Col span={12}>
                            <Upload
                                disabled={preview}
                                name="uploadPic"
                                listType="picture-card"
                                className="pic-uploader"
                                showUploadList={false}
                                action="/uploadPic"
                                beforeUpload={beforeUpload}
                                onChange={handleChangeUploadCode}
                            >
                                {imageUrlCode ? <img className='change_avatar' src={imageUrlCode} alt="imageUrlCode" style={{ width: '100%' }} /> : <div>
                                    {loadingCode ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>??????</div>
                                </div>}
                            </Upload>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div >
    )
}
