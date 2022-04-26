import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom'
import 'echarts/extension/bmap/bmap';  //引入bmap
import { List, Typography } from 'antd'
import './index.css'
export default function HomeHealth() {
    const e8 = useRef()
    const navigate = useNavigate()
    const [hitTopList, setHitTopList] = useState([])
    const [starTopList, setStarTopList] = useState([])
    useEffect(() => {
        axios.get('/admin/getTopicHitTop5').then(res => {
            setHitTopList(res.data.topicHitTop)
            setStarTopList(res.data.topicStarTop)
        })
    }, [])
    useEffect(() => {
        axios.get('/admin/getHomeHoard').then(res => {
            let data = res.data.results
            let hoardcateList = []
            let countList = []
            data.map(item => {
                hoardcateList.push(item.hoardcate)
                countList.push(item.count)
                return item
            })
            let myChart2 = echarts.init(e8.current)
            let option = {
                title: {
                    text: '论坛分类数量分布图示',
                },
                legend: {
                    data: ['数量'],
                },
                minInterval: 1,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: hoardcateList,
                        axisTick: {
                            alignWithLabel: true
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        barWidth: '40%',
                        data: countList
                    }
                ]
            };
            // 绘制图表
            option && myChart2.setOption(option);
        })
    }, [])
    return (
        <div>
            <div className="Hoard_echerts1" ref={e8}></div>
            <div className="Hoard_right">
                <List
                    header={<div>点击量最多的前4条帖子</div>}
                    bordered={false}
                    dataSource={hitTopList}
                    renderItem={item => (
                        <List.Item onClick={() => navigate('/hoard/check/' + item.topicid)} className="Hoard_topic">
                            {item.title}<Typography.Text className="Hoard_span" type="warning">点击量：{item.hits}</Typography.Text>
                        </List.Item>
                    )}
                />
                <List
                    header={<div>点赞最多的前4条帖子</div>}
                    bordered={false}
                    dataSource={starTopList}
                    renderItem={item => (
                        <List.Item onClick={() => navigate('/hoard/check/' + item.topicid)} className="Hoard_topic">
                            {item.title}<Typography.Text className="Hoard_span" type="warning">点赞：{item.star}</Typography.Text>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}
