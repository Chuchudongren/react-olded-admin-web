import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'
import { PageHeader, Descriptions } from 'antd'
export default function NewsPreview() {
    const params = useParams()
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        axios.post('/admin/getNewsById', qs.stringify({ newsid: params.newsid })).then(res => {
            setNewsInfo(res.data.results)
        })
    }, [])
    return (
        <div>
            {newsInfo && (
                <>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                    >
                        <Descriptions column={3}>
                            <Descriptions.Item label="来源">
                                {newsInfo.source}
                            </Descriptions.Item>
                            <Descriptions.Item label="发布时间">
                                {newsInfo.pushtime}
                            </Descriptions.Item>
                            <Descriptions.Item label="展示图片">
                                <img style={{
                                    width: '300px',
                                    height: 'auto',
                                    maxHeight: '150px',
                                    objectFit: 'contain',
                                    position: 'absolute'
                                }} src={newsInfo.pic} alt="" />
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions column={3}>
                            <Descriptions.Item label="是否热门">
                                {newsInfo.ishot ? '是' : '否'}
                            </Descriptions.Item>
                            <Descriptions.Item label="点赞数量">
                                {newsInfo.great}
                            </Descriptions.Item>
                            <Descriptions.Item label="收藏数量">
                                {newsInfo.collect}
                            </Descriptions.Item>

                            <Descriptions.Item label="评论数量">
                                {newsInfo.comment}
                            </Descriptions.Item>
                            <Descriptions.Item label="新闻纪要">
                                {newsInfo.summary}
                            </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div
                        style={{
                            border: '2px solid #8c8c8c5e',
                            padding: '10px 24px',
                            marginTop: '20px',
                            minHeight: '300px',
                        }}
                        dangerouslySetInnerHTML={{ __html: newsInfo.content }}
                    ></div>
                </>
            )
            }
        </div >
    )
}
