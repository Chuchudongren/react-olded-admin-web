import React, { useRef, useState } from 'react'
import {
    PageHeader,
    Steps,
    Button,
    Form,
    Input,
    message,
    Upload,
    notification,
    Row,
    Col
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import qs from 'qs'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import NewsEditor from '../../../../components/sandbox/newseditor'
const { Step } = Steps
export default function VoluntAdd() {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [formInfo, setFormInfo] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState([])
    const NewsForm = useRef(null)

    const next = () => {
        if (current === 0) {
            NewsForm.current
                .validateFields()
                .then((res) => {
                    setFormInfo(res)
                    setCurrent(current + 1)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            if (content.length === 0 || content.trim() === '<p></p>') {
                message.error('志愿者活动内容部分不能为空!')
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const prev = () => {
        setCurrent(current - 1)
    }
    const handleSave = () => {
        axios.post('/admin/addVolunt', qs.stringify({ content, pic: imageUrl, ...formInfo })).then(res => {
            if (res.data.status === 200) {
                notification.info({
                    message: `通知: ${res.data.message}!`,
                    description: `您可以到志愿者活动管理中查看您的新闻`,
                    placement: 'bottomRight',
                })
            }
        })
        navigate('/life/volunt/list')
    }
    // 从 组件中获得 富文本内容
    const getContent = (contents) => {
        setContent(contents)
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
    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false)
            setImageUrl(info.file.response.url)
        };
    }
    return (
        <div style={{ padding: '10px' }}>
            <PageHeader
                className="site-page-header"
                title="发布志愿互动"
                subTitle="这里发布志愿活动"
            />
            <Steps current={current}>
                <Step title="基本信息" description="标题/时间/地点" />
                <Step title="活动内容" description="内容" />
                <Step title="志愿者活动发布" description="发布" />
            </Steps>
            {/* 主体内容 */}

            <div style={{ marginTop: '30px' }}>
                {/* 步骤1 内容 */}
                <div className={current === 0 ? '' : 'hidden'}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        // onFinish={onFinish}
                        ref={NewsForm}
                    >
                        <Row gutter={24}>
                            <Col span={24} >
                                <Form.Item
                                    label="标题"
                                    name="title"
                                    rules={[{ required: true, message: '请输入标题!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} >
                                <Form.Item
                                    label="地点"
                                    name="space"
                                    rules={[{ required: true, message: '请输入地点!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12} >
                                <Form.Item
                                    label="团队名称"
                                    name="teamname"
                                    rules={[{ required: true, message: '请输入团队名称!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} >
                                <Form.Item
                                    label="开始时间"
                                    name="begintime"
                                    rules={[{ required: true, message: '请输入开始时间!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}  >
                                <Form.Item
                                    label="结束时间"
                                    name="finishtime"
                                    rules={[{ required: true, message: '请输入结束时间!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} >
                                <Form.Item
                                    label="联系电话"
                                    name="tel"
                                    rules={[{ required: true, message: '请输入联系电话!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}  >
                                <Form.Item
                                    label="活动类型"
                                    name="classification"
                                    rules={[{ required: true, message: '请输入活动类型!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div>
                            <span className="pic_text">上传志愿活动展示图片</span>
                            <Upload
                                name="uploadPic"
                                listType="picture-card"
                                className="pic-uploader"
                                showUploadList={false}
                                action="/uploadPic"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {imageUrl ? <img className='change_avatar' src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>上传</div>
                                </div>}
                            </Upload>
                        </div>
                    </Form>

                </div>
                {/* 步骤2 内容 */}
                <div className={current === 1 ? '' : 'hidden'}>
                    <NewsEditor getContent={getContent}></NewsEditor>
                </div>
                {/* 步骤3 内容 */}
                <div className={current === 2 ? '' : 'hidden'}>
                </div>
            </div>
            <div>
                {current === 2 && (
                    <span>
                        <Button
                            danger
                            onClick={() => {
                                handleSave()
                            }}
                        >
                            发布
                        </Button>
                    </span>
                )}
                {current < 2 && (
                    <Button type="primary" onClick={next}>
                        下一步
                    </Button>
                )}
                &nbsp;&nbsp;
                {current > 0 && (
                    <Button type="primary" onClick={prev}>
                        上一步
                    </Button>
                )}
            </div>
        </div >

    )
}
