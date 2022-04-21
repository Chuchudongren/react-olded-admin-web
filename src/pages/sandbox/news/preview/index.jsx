import React from 'react'
import { useParams } from 'react-router-dom'
export default function NewsPreview(props) {
    const params = useParams()
    return (
        <div>{params.newsid}</div>
    )
}
