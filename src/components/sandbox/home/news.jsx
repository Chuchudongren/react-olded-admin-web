import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as echarts from 'echarts';
import './index.css'
export default function HomeNews() {
    const e1 = useRef()
    const e2 = useRef()
    useEffect(() => {
        axios.get('/admin/getHomeNews').then(res => {
            let data = res.data.results
            let categorynameList = []
            let countList = []
            let greatSumList = []
            let collectSumList = []
            data.map(item => {
                categorynameList.push(item.categoryname)
                countList.push({
                    value: item.count, name: item.categoryname
                })
                greatSumList.push(item.greatSum)
                collectSumList.push(item.collectSum)
                return item
            })
            var myChart = echarts.init(e1.current, null, {
                width: 600,
                height: 400,
            });
            var myChart1 = echarts.init(e2.current, null, {
                width: 500,
                height: 400,
            });
            let option = {
                title: {
                    text: '新闻点赞收藏数量图示',
                },
                legend: {
                    data: ['点赞', '收藏'],
                },
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
                        data: categorynameList,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '点赞',
                        type: 'bar',
                        barWidth: '40%',
                        data: greatSumList
                    },
                    {
                        name: '收藏',
                        type: 'bar',
                        barWidth: '40%',
                        color: 'pink',
                        data: collectSumList
                    }
                ]
            };
            let option1 = {
                tooltip: {
                    trigger: 'item'
                },
                title: {
                    text: '新闻数量图示',
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '新闻数量',
                        type: 'pie',
                        radius: ['40%', '70%'],
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
            option && myChart.setOption(option);
            option && myChart1.setOption(option1);
        })
    }, [])
    return (
        <div>
            <div className="news_echars1" ref={e1}></div>
            <div className="news_echars2" ref={e2}></div>
        </div>
    )
}
