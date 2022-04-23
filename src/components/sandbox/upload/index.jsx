import React from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function UploadComponent(props) {
    const props1 = {
        name: 'read',
        action: props.action,
        maxCount: 1,
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name}上传成功！`);
                props.getFuc(info.file.response.url)
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name}上传失败！`);
            }
        },
    };
    return (
        <Upload {...props1}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
    )
}
