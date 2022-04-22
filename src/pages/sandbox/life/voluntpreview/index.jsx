import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'
import { PageHeader, Descriptions } from 'antd'
export default function VoluntPreview() {
    const params = useParams()
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        axios.post('/admin/getVoluntById', qs.stringify({ voluntid: params.voluntid })).then(res => {
            setNewsInfo(res.data.results)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <Descriptions.Item label="标题">
                                {newsInfo.title}
                            </Descriptions.Item>
                            <Descriptions.Item >
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
                            <Descriptions.Item label="是否推荐">
                                {newsInfo.isrecommend ? '是' : '否'}
                            </Descriptions.Item>
                            <Descriptions.Item label="状态">
                                {newsInfo.status === 1 ? '进行中' : (newsInfo.status === 0 ? '未开始' : '已结束')}
                            </Descriptions.Item>
                            <Descriptions.Item >
                            </Descriptions.Item>
                            <Descriptions.Item label="地点">
                                {newsInfo.space}
                            </Descriptions.Item>
                            <Descriptions.Item label="参加人数">
                                {newsInfo.peoplenumber}
                            </Descriptions.Item>
                            <Descriptions.Item >
                            </Descriptions.Item>
                            <Descriptions.Item label="团队名称">
                                {newsInfo.teamname}
                            </Descriptions.Item>
                            <Descriptions.Item label="联系电话">
                                {newsInfo.teamname}
                            </Descriptions.Item>
                            <Descriptions.Item >
                            </Descriptions.Item>
                            <Descriptions.Item label="活动类型">
                                {newsInfo.classification}
                            </Descriptions.Item>

                            <Descriptions.Item label="开始时间">
                                {newsInfo.begintime}
                            </Descriptions.Item>
                            <Descriptions.Item label="结束时间">
                                {newsInfo.finishtime}
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
