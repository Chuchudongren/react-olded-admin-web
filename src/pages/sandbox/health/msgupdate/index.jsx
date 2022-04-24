import React, { useEffect, useRef, useState } from 'react'
import {
    PageHeader,
    Steps,
    Button,
    Form,
    Input,
    Select,
    message,
    notification,
} from 'antd'
import qs from 'qs'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import NewsEditor from '../../../../components/sandbox/newseditor'
const { Option } = Select
const { Step } = Steps
const { TextArea } = Input;
export default function Add() {
    const params = useParams()
    const [current, setCurrent] = useState(0)
    const [formInfo, setFormInfo] = useState([])
    const [content, setContent] = useState([])
    useEffect(() => {
        axios.post('/admin/getHealthMsgById', qs.stringify({ healthmsgid: params.healthmsgid })).then(res => {
            NewsForm.current.setFieldsValue({
                ...res.data.results,
            })
            setContent(res.data.results.content)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
                message.error('资讯内容部分不能为空!')
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const prev = () => {
        setCurrent(current - 1)
    }
    const handleSave = () => {
        axios.post('/admin/updateHealthMsg', qs.stringify({ healthmsgid: params.healthmsgid, content, ...formInfo })).then(res => {
            if (res.data.status === 200) {
                notification.info({
                    message: `通知: 修改成功!`,
                    description: `您可以到健康资讯列表中查看您的资讯`,
                    placement: 'bottomRight',
                })
            }
        })
    }
    const NewsForm = useRef(null)

    // 从 组件中获得 富文本内容
    const getContent = (contents) => {
        setContent(contents)
    }

    return (
        <div style={{ padding: '10px' }}>
            <PageHeader
                className="site-page-header"
                title="撰写资讯"
                subTitle="这里添加资讯"
            />
            <Steps current={current}>
                <Step title="基本信息" description="资讯标题/资讯分类" />
                <Step title="资讯内容" description="资讯主体内容" />
                <Step title="资讯提交" description="提交发布" />
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
                            label="资讯标题"
                            name="title"
                            rules={[{ required: true, message: '请输入资讯标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="分类"
                            name="grade"
                            rules={[{ required: true, message: '请输入资讯分类!' }]}
                        >
                            <Select>
                                <Option value='健康常识'>健康常识</Option>
                                <Option value='热点'>热点</Option>
                                <Option value='膳食知识'>膳食知识</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="资讯介绍"
                            name="intro"
                            rules={[{ required: true, message: '请输入资讯纪要!' }]}
                        >
                            <TextArea showCount maxLength={220} style={{ height: 200 }} />
                        </Form.Item>
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
