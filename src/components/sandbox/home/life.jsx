import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';  //引入bmap
import './index.css'
import { data, geoCoordMap } from './map'

export default function HomeNews() {
    const e3 = useRef()
    const e4 = useRef()
    const e5 = useRef()
    useEffect(() => {
        let convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };
        let option = {
            title: {
                text: '志愿者全国分布情况',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '人数',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    encode: {
                        value: 2
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                {
                    name: '前五名',
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: convertData(
                        data
                            .sort(function (a, b) {
                                return b.value - a.value;
                            })
                            .slice(0, 6)
                    ),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    encode: {
                        value: 2
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    },
                    emphasis: {
                        scale: true
                    },
                    zlevel: 1
                }
            ],
            bmap: {
                center: [116.46, 39.92],
                zoom: 5,
                roam: true,
                mapStyle: {
                    styleJson: [
                        {
                            featureType: 'water',
                            elementType: 'all',
                            stylers: {
                                color: '#d1d1d1'
                            }
                        },
                        {
                            featureType: 'land',
                            elementType: 'all',
                            stylers: {
                                color: '#f3f3f3'
                            }
                        },
                        {
                            featureType: 'railway',
                            elementType: 'all',
                            stylers: {
                                visibility: 'off'
                            }
                        },
                        {
                            featureType: 'highway',
                            elementType: 'all',
                            stylers: {
                                color: '#fdfdfd'
                            }
                        },
                        {
                            featureType: 'highway',
                            elementType: 'labels',
                            stylers: {
                                visibility: 'off'
                            }
                        },
                        {
                            featureType: 'arterial',
                            elementType: 'geometry',
                            stylers: {
                                color: '#fefefe'
                            }
                        },
                        {
                            featureType: 'arterial',
                            elementType: 'geometry.fill',
                            stylers: {
                                color: '#fefefe'
                            }
                        },
                        {
                            featureType: 'poi',
                            elementType: 'all',
                            stylers: {
                                visibility: 'off'
                            }
                        },
                        {
                            featureType: 'green',
                            elementType: 'all',
                            stylers: {
                                visibility: 'off'
                            }
                        },
                        {
                            featureType: 'subway',
                            elementType: 'all',
                            stylers: {
                                visibility: 'off'
                            }
                        },
                        {
                            featureType: 'manmade',
                            elementType: 'all',
                            stylers: {
                                color: '#d1d1d1'
                            }
                        },
                        {
                            featureType: 'local',
                            elementType: 'all',
                            stylers: {
                                color: '#d1d1d1'
                            }
                        },
                        {
                            featureType: 'arterial',
                            elementType: 'labels',
                            stylers: {
                                visibility: 'off'
                            }
                        },
                        {
                            featureType: 'boundary',
                            elementType: 'all',
                            stylers: {
                                color: '#fefefe'
                            }
                        },
                        {
                            featureType: 'building',
                            elementType: 'all',
                            stylers: {
                                color: '#d1d1d1'
                            }
                        },
                        {
                            featureType: 'label',
                            elementType: 'labels.text.fill',
                            stylers: {
                                color: '#999999'
                            }
                        }
                    ]
                }
            },

        };
        let mapInstance;
        function renderChart() {
            const renderedInstance = echarts.getInstanceByDom(e3.current);
            if (renderedInstance) {
                mapInstance = renderedInstance;
            } else {
                mapInstance = echarts.init(e3.current);
            }
            mapInstance.setOption(option);
        };
        renderChart();
    }, []);
    useEffect(() => {
        axios.get('/admin/getLawdynamicCount').then(res => {
            let data = res.data.results
            let countList = []
            data.map(item => {
                countList.push({
                    value: item.count, name: item.themename
                })
                return item
            })
            var myChart1 = echarts.init(e4.current);
            let option = {
                tooltip: {
                    trigger: 'item'
                },
                title: {
                    text: '普法动态数量图示',
                },
                legend: {
                    top: '10%',
                    left: 'center'
                },
                series: [
                    {
                        name: '普法动态数量',
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
        axios.get('/admin/getHomeService').then(res => {
            let data = res.data.results
            let nameList = []
            let countList = []
            data.map(item => {
                nameList.push(item.name)
                countList.push(item.count)
                return item
            })
            let myChart2 = echarts.init(e5.current)
            let option = {
                title: {
                    text: '家政服务数量图示',
                },
                legend: {
                    data: ['数量'],
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
                        data: nameList,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            rotate: '45',
                            interval: 0,
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
            <div className="life_row1">
                <div className="life_echarts1" ref={e3}></div>
                <div className="life_echarts2" ref={e4}></div>
            </div>
            <div className="life_echarts3" ref={e5}></div>
        </div>
    )
}
