import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import qs from 'qs'
import { useParams, useNavigate } from 'react-router-dom'
import { getHoardData } from './gethoarddata.js'
import { message, Button, PageHeader, Descriptions, Divider } from 'antd'
import './index.css'
function HoardDetail() {
    const params = useParams()
    const navigate = useNavigate()
    const tipicfollow = useRef()
    const comment = useRef()
    const commentSon = useRef()
    const [topicdata, setTopicData] = useState({})
    const [topicFollowdata, setTopicFollowData] = useState([])
    const [topicCommentdata, setTopicCommentData] = useState([])
    const [allData, setAllData] = useState({})
    const [flash, setFlash] = useState(false)

    useEffect(() => {
        axios.post('/admin/getTopicByid', qs.stringify({ topicid: params.topicid })).then(res => {
            setTopicData(res.data.results);
        })
        axios.post('/admin/getTopicFollowByid', qs.stringify({ topicid: params.topicid })).then(res => {
            setTopicFollowData(res.data.results);
        })
        axios.post('/admin/getTopicCommentByid', qs.stringify({ topicid: params.topicid })).then(res => {
            setTopicCommentData(res.data.results);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        setAllData(getHoardData(topicdata, topicFollowdata, topicCommentdata))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicCommentdata])
    const handlePut = (e) => {
        e.target.parentNode.nextSibling.className = e.target.parentNode.nextSibling.className === 'topicfollowdata' ? 'topicfollowdata hidden' : 'topicfollowdata'
    }
    const HandleDelete = (...args) => {
        let g = args.length
        switch (g) {
            case 1:
                let newData1 = allData
                newData1.topicfollowdata = newData1.topicfollowdata.filter(item => item.topicfollowid !== args[0])
                axios.post('/admin/deleteTopicFollowById', qs.stringify({ topicfollowid: args[0] })).then(res => {
                    if (res.data.status === 200) message.success(res.data.message)
                })
                setAllData(newData1)
                break;
            case 2:
                let newData2 = allData
                newData2.topicfollowdata.map(item => {
                    if (item.topicfollowid === args[0]) {
                        item.commentdata = item.commentdata.filter(item1 => item1.topiccommentid !== args[1])
                    }
                    return item
                })
                axios.post('/admin/deleteCommentById', qs.stringify({ topiccommentid: args[1] })).then(res => {
                    console.log(res);
                    if (res.data.status === 200) message.success(res.data.message)
                })
                setAllData(newData2)
                break;
            case 3:
                let newData3 = allData
                newData3.topicfollowdata.map(item => {
                    if (item.topicfollowid === args[0]) {
                        item.commentdata.map(item1 => {
                            if (item1.topiccommentid === args[1]) {
                                item1.sonComment = item1.sonComment.filter(item2 => item2.topiccommentid !== args[2])
                            }
                            return item1
                        })
                    }
                    return item
                })
                axios.post('/admin/deleteSonCommentById', qs.stringify({ topiccommentid: args[2] })).then(res => {
                    if (res.data.status === 200) message.success(res.data.message)
                })
                setAllData(newData3)
                break;
            default:
                break;
        }
        setFlash(!flash)
    }
    return (
        <>
            {allData && (
                <>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={allData.title}
                        key={flash}
                    >
                        <Descriptions column={3}>
                            <Descriptions.Item label="话题ID">
                                {allData.cateid}
                            </Descriptions.Item>
                            <Descriptions.Item label="作者">
                                {allData.nickname}
                            </Descriptions.Item>
                            <Descriptions.Item label="发布时间">
                                {allData.pushtime}
                            </Descriptions.Item>
                            <Descriptions.Item label="分类">
                                {allData.hoardcate}
                            </Descriptions.Item>
                            <Descriptions.Item label="是否热门">
                                {allData.ishot ? '是' : '否'}
                            </Descriptions.Item>
                            <Descriptions.Item label="点赞数量">
                                {allData.star}
                            </Descriptions.Item>
                            <Descriptions.Item label="点击数量">
                                {allData.hits}
                            </Descriptions.Item>
                            <Descriptions.Item label="回复时间">
                                {allData.replytime}
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions column={1}>
                            <Descriptions.Item label="内容">
                                <div className="hoar_content" dangerouslySetInnerHTML={{ __html: allData.content }}></div>
                            </Descriptions.Item>
                        </Descriptions>
                        {allData.topicfollowdata?.length > 0 ? allData.topicfollowdata.map(item =>
                            <div key={item.topicfollowid === undefined ? item : item.topicfollowid}>
                                <Divider onClick={(e) => handlePut(e)} className="hoard_turn_down" style={{ fontSize: '20px' }}>查看跟帖{item.topicfollowid}</Divider>
                                <div ref={tipicfollow} className="topicfollowdata hidden">
                                    <Descriptions column={3}>
                                        <Descriptions.Item label="跟帖ID">
                                            {item.topicfollowid}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="发布时间">
                                            {item.pushtime}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="作者">
                                            {item.nickname}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Descriptions column={1}>
                                        <Descriptions.Item style={{ position: 'relative' }} label="内容">
                                            <div
                                                className="hoar_content"
                                                dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                            <Button className="hoard_delete_btn" type="primary" onClick={() => { HandleDelete(item.topicfollowid) }}>删除</Button>
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <div style={{ marginLeft: '220px' }}>
                                        {item.commentdata?.length > 0 ? item.commentdata.map(item_comment =>
                                            <div key={item_comment.topiccommentid}>
                                                <Divider onClick={(e) => handlePut(e)} className="hoard_turn_down" style={{ fontSize: '20px' }}>查看评论{item_comment.topiccommentid}</Divider>
                                                <div ref={comment} className="hidden" >
                                                    <Descriptions column={3}>
                                                        <Descriptions.Item label="评论ID">
                                                            {item_comment.topiccommentid}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="发布时间">
                                                            {item_comment.pushtime}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="作者">
                                                            {item_comment.nickname}
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                    <Descriptions column={1}>
                                                        <Descriptions.Item style={{ position: 'relative' }} label="内容">
                                                            <div
                                                                className="hoar_content"
                                                                dangerouslySetInnerHTML={{ __html: item_comment.content }}></div>
                                                            <Button className="hoard_delete_btn" type="primary" onClick={() => { HandleDelete(item.topicfollowid, item_comment.topiccommentid) }}>删除</Button>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                    <div style={{ marginLeft: '100px' }}>
                                                        {item_comment.sonComment?.length > 0 ? item_comment.sonComment.map(item_commentson =>
                                                            <div key={item_commentson.topiccommentid}>
                                                                <Divider onClick={(e) => handlePut(e)} className="hoard_turn_down" style={{ fontSize: '20px' }}>查看评论{item_commentson.topiccommentid}</Divider>
                                                                <div ref={commentSon} className="hidden" >
                                                                    <Descriptions column={3}>
                                                                        <Descriptions.Item label="评论ID">
                                                                            {item_commentson.topiccommentid}
                                                                        </Descriptions.Item>
                                                                        <Descriptions.Item label="发布时间">
                                                                            {item_commentson.pushtime}
                                                                        </Descriptions.Item>
                                                                        <Descriptions.Item width={'120px'} label="作者">
                                                                            {item_commentson.nickname}
                                                                        </Descriptions.Item>
                                                                    </Descriptions>
                                                                    <Descriptions column={1}>
                                                                        <Descriptions.Item style={{ position: 'relative' }} label="内容">
                                                                            <div
                                                                                className="hoar_content"
                                                                                dangerouslySetInnerHTML={{ __html: item_commentson.content }}></div>
                                                                            <Button className="hoard_delete_btn" type="primary" onClick={() => { HandleDelete(item.topicfollowid, item_comment.topiccommentid, item_commentson.topiccommentid) }}>删除</Button>
                                                                        </Descriptions.Item>
                                                                    </Descriptions>
                                                                </div>
                                                            </div>
                                                        ) : <></>}
                                                    </div>
                                                </div>
                                            </div>) : <></>}
                                    </div>
                                </div>
                            </div>
                        ) : <></>}
                    </PageHeader>
                </>
            )
            }
        </>
    )
}

export default HoardDetail