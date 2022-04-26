import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';  //引入bmap
import { Descriptions } from 'antd'
import './index.css'
export default function HomeHealth() {
    const e6 = useRef()
    const e7 = useRef()
    const [counts, setCounts] = useState([])
    useEffect(() => {
        axios.get('/admin/getHomeHealthInfo').then(res => {
            setCounts(res.data.counts)
        })
    }, [])
    useEffect(() => {
        axios.get('/admin/getHomeHealthMsg').then(res => {
            let data = res.data.results
            let countList = []
            let cate = ['健康常识', '热点', '膳食知识']
            data.map(item => {
                countList.push({
                    value: item.count, name: cate[item.grade - 1]
                })
                return item
            })
            var myChart1 = echarts.init(e6.current);
            let option = {
                tooltip: {
                    trigger: 'item'
                },
                title: {
                    text: '健康咨询分布图示',
                },
                legend: {
                    top: '10%',
                    left: 'center'
                },
                series: [
                    {
                        name: '咨询数量',
                        type: 'pie',
                        radius: ['20%', '70%'],
                        top: '10%',
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: countList
                    }
                ]
            };
            // 绘制图表
            option && myChart1.setOption(option);
        })
    }, [])
    useEffect(() => {
        axios.get('/admin/getHomeClinicRecord').then(res => {
            let data = res.data.results
            let timeslotList = []
            let countList = []
            data.map(item => {
                timeslotList.push(item.timeslot)
                countList.push(item.count)
                return item
            })
            let myChart2 = echarts.init(e7.current)
            let option = {
                title: {
                    text: '诊所预约时间段分布',
                },
                legend: {
                    data: ['时间段'],
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
                        data: timeslotList,
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
                        name: '时间段',
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
            <Descriptions
                title="健康管理信息"
                bordered
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="在档医院数量">{counts.length > 0 ? counts[0].Hcount : ''}</Descriptions.Item>
                <Descriptions.Item label="在档诊所数量">{counts.length > 0 ? counts[1].Ccount : ''}</Descriptions.Item>
                <Descriptions.Item label="预约记录情况">{counts.length > 0 ? counts[2].Rcount : ''}</Descriptions.Item>
            </Descriptions>
            <div className="Health_echerts1" ref={e6}></div>
            <div className="Health_echerts2" ref={e7}></div>
        </div>
    )
}
