import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Modal, Upload, Form, Row, Col, message, Select } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import {
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
    const [filteredInfo, setfilteredInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [currentItem, setCurrentItem] = useState({})
    const [preview, setPreview] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [form_modal] = Form.useForm();


    useEffect(() => {
        axios.get('/admin/getServiceList').then(res => {
            if (res.data.status === 200) {
                setdataSource(res.data.results)
            }
        })
    }, [])
    const columns = [
        {
            title: '商户id',
            dataIndex: 'servicelistid',
            width: '10%',
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: '50%',
        },
        {
            title: '分类',
            dataIndex: 'category',
            width: '20%',
            filters: [
                { text: '找保姆', value: '找保姆' },
                { text: '找保洁', value: '找保洁' },
                { text: '找维修', value: '找维修' },
                { text: '找跑腿', value: '找跑腿' },
                { text: '找搬家', value: '找搬家' },
            ],
            filteredValue: filteredInfo.category || null,
            onFilter: (category, record) => record.category.includes(category),
            ellipsis: true,
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
                                setImageUrl(item.pic)
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
                            }}
                        />
                    </>
                )
            },
        },
    ]
    const handleChangeTable = (pagination, filters) => {
        setfilteredInfo(filters)
    }
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('你只能上传JPG/PNG格式的图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片需要小于2MB!');
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
        setdataSource(dataSource.filter((data) => data.servicelistid !== item.servicelistid))
        axios.post('/admin/deleteMessageById', qs.stringify({ servicelistid: item.servicelistid })).then(res => {
            if (res.data.status === 200) message.success(res.data.message)
            else message.error(res.data.message)
        })
    }
    const handleOk = () => {
        const formdata = form_modal.getFieldsValue()
        if (Object.keys(currentItem).length === 0) {
            let newData = [...dataSource]
            axios.post('/admin/addService', qs.stringify({ ...formdata, pic: imageUrl })).then(res => {
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    newData.push({ servicelistid: res.data.servicelistid, ...formdata, pic: imageUrl })
                    setdataSource(newData)
                }
            })
        } else {
            axios.post('/admin/UpdateService', qs.stringify({ servicelistid: currentItem.servicelistid, ...formdata, pic: imageUrl })).then(res => {
                if (res.data.status === 200) message.success(res.data.message)
                axios.get('/admin/getServiceList').then(res => {
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
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowClassName="editable-row"
                rowKey={(item) => item.servicelistid}
                pagination={{
                    pageSize: 5,
                }}
                onChange={handleChangeTable}

            />
            <Button
                style={{ width: '120px', height: '40px', fontSize: '20px', marginLeft: '50px', marginTop: '-50px' }}
                type='primary'
                onClick={() => {
                    let resetObj = {
                        title: '',
                        conpany: '',
                        servicearea: '',
                        province: '',
                        city: '',
                        tel: '',
                        name: '',
                        category: '',
                    }
                    setImageUrl('')
                    form_modal.setFieldsValue(resetObj)
                    setCurrentItem({})
                    setIsModalVisible(true)
                }}
            >添加用户</Button>
            <Modal width='800px' title="家政服务商家" cancelText='取消' okText='确定' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form_modal}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="商家标题"
                                name="title"
                                rules={[{ required: true, message: '请输入商家标题!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="公司名称"
                                name="conpany"
                                rules={[{ required: true, message: '请输入公司名称!' }]}
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
                                rules={[{ required: true, message: '请输入联系方式!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="城市"
                                name="city"
                                rules={[{ required: true, message: '请输入联系方式!' }]}
                            >
                                <Input disabled={preview} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="服务范围"
                                name="servicearea"
                                rules={[{ required: true, message: '请输入服务范围!' }]}
                            >
                                <TextArea disabled={preview} className="message_textArea" rows={3} showCount maxLength={200} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="分类"
                                name="category"
                                rules={[{ required: true, message: '请选择分类!' }]}
                            >
                                <Select disabled={preview}>
                                    <Select.Option value="找保姆">找保姆</Select.Option>
                                    <Select.Option value="找保洁">找保洁</Select.Option>
                                    <Select.Option value="找维修">找维修</Select.Option>
                                    <Select.Option value="找跑腿">找跑腿</Select.Option>
                                    <Select.Option value="找搬家">找搬家</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="二级分类"
                                name="name"
                                rules={[{ required: true, message: '请选择二级分类!' }]}
                            >
                                <Select disabled={preview}>
                                    <Select.Option value="住家保姆">住家保姆</Select.Option>
                                    <Select.Option value="不住家保姆">不住家保姆</Select.Option>
                                    <Select.Option value="钟点工">钟点工</Select.Option>
                                    <Select.Option value="催乳师">催乳师</Select.Option>
                                    <Select.Option value="陪护">陪护</Select.Option>
                                    <Select.Option value="做饭阿姨">做饭阿姨</Select.Option>
                                    <Select.Option value="清洗空调">清洗空调</Select.Option>
                                    <Select.Option value="清洗油烟机">清洗油烟机</Select.Option>
                                    <Select.Option value="清洗洗衣机">清洗洗衣机</Select.Option>
                                    <Select.Option value="清洗沙发">清洗沙发</Select.Option>
                                    <Select.Option value="清洗地毯">清洗地毯</Select.Option>
                                    <Select.Option value="卫浴维修">卫浴维修</Select.Option>
                                    <Select.Option value="电路维修">电路维修</Select.Option>
                                    <Select.Option value="水管维修">水管维修</Select.Option>
                                    <Select.Option value="门窗维修">门窗维修</Select.Option>
                                    <Select.Option value="蔬菜水果">蔬菜水果</Select.Option>
                                    <Select.Option value="桶装水">桶装水</Select.Option>
                                    <Select.Option value="粮油副食">找搬家</Select.Option>
                                    <Select.Option value="煤气">煤气</Select.Option>
                                    <Select.Option value="小型搬家">小型搬家</Select.Option>
                                    <Select.Option value="居民搬家">居民搬家</Select.Option>
                                    <Select.Option value="家具拆装">家具拆装</Select.Option>
                                    <Select.Option value="设备迁移">设备迁移</Select.Option>
                                    <Select.Option value="长途搬家">长途搬家</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
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
                        {imageUrl ? <img className='change_avatar' src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <div>
                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                            <div style={{ marginTop: 8 }}>上传</div>
                        </div>}
                    </Upload>
                </Form>
            </Modal>
        </div >
    )
}
