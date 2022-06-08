import React, { useEffect, useRef, useState } from 'react'
import {
    PageHeader,
    Steps,
    Button,
    Form,
    Input,
    Select,
    message,
    Upload,
    notification,
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import qs from 'qs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import NewsEditor from '../../../../components/sandbox/newseditor'
const { Option } = Select
const { Step } = Steps
const { TextArea } = Input;
export default function Add() {
    const navigate = useNavigate()
    const params = useParams()
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState([])

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
                message.error('新闻内容部分不能为空!')
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const prev = () => {
        setCurrent(current - 1)
    }
    const handleSave = () => {
        axios.post('/admin/addNews', qs.stringify({ newsid: params.newsid, content, pic: imageUrl, ...formInfo })).then(res => {
            if (res.data.status === 200) {
                notification.info({
                    message: `通知: ${res.data.message}!`,
                    description: `您可以到新闻列表中查看您的新闻`,
                    placement: 'bottomRight',
                })
            }
        })
        // navigate('/news/list')
    }

    useEffect(() => {
        axios.post('/admin/getNewsById', qs.stringify({ newsid: params.newsid })).then(res => {
            NewsForm.current.setFieldsValue({
                ...res.data.results,
                categoryId: res.data.results.categoryid
            })
            setImageUrl(res.data.results.pic)
            setContent(res.data.results.content)

        })
        axios.get('/admin/getCategory').then((res) => {
            setCategoryList(res.data.results)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const NewsForm = useRef(null)

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
                title="撰写新闻"
                subTitle="这里添加新闻"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题/新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="发布" />
            </Steps>
            {/* 主体内容 */}

            <div style={{ marginTop: '30px' }}>
                {/* 步骤1 内容 */}
                <div className={current === 0 ? '' : 'hidden'}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 18 }}
                        // onFinish={onFinish}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请输入新闻分类!' }]}
                        >
                            <Select>
                                {categoryList.map((item) => {
                                    return (
                                        <Option key={item.categoryid} value={item.categoryid}>
                                            {item.categoryname}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="新闻纪要"
                            name="summary"
                            rules={[{ required: true, message: '请输入新闻纪要!' }]}
                        >
                            <TextArea showCount maxLength={120} style={{ height: 120 }} />
                        </Form.Item>
                        <Form.Item
                            label="来源"
                            name="source"
                            rules={[{ required: true, message: '请输入新闻来源!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <div>
                            <span className="pic_text">上传新闻展示图片</span>
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
                    <NewsEditor content={content} getContent={getContent}></NewsEditor>
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
