import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd'
import * as UserApi from '@/api/user'
import { formatDate } from '@/libs/date'
import './index.styl'

const User = () => {
    const [ users, setUsers ] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ currentItem, setCurrentItem ] = useState({ code: '', username: '', nickName: '' })
    const [ currentType, setCurrentType ] = useState(null)
    const columns = [{
        title: '工号',
        dataIndex: 'code',
        key: 'code',
        width: 100
    }, {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
        width: 120
    }, {
        title: '花名',
        dataIndex: 'nickName',
        key: 'nickName',
        width: 120
    }, {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        render: time => formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss'),
        width: 170
    }, {
        title: '修改时间',
        dataIndex: 'updateAt',
        key: 'updateAt',
        render: time => formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss'),
        width: 170
    }, {
        title: '操作',
        dataIndex: '',
        key: '',
        width: 180,
        render: item => {
            return (
                <Space size="middle">
                    <Button type="primary" onClick={() => editColumn(item, 2)}>编辑</Button>
                    <Popconfirm
                        title="确认要删除这条记录吗？"
                        onConfirm={onDelete}>
                        <Button type="primary" danger={true} onClick={() => delColumn(item)}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    }]

    const savePrize = () => {
        setCurrentItem({ code: '', username: '', nickName: '' })
        setCurrentType(1)
        setVisible(true)
    }

    const editColumn = (item) => {
        setCurrentItem(item)
        setCurrentType(2)
        setVisible(true)
    }

    const delColumn = async (item) => {
        setCurrentItem(item)
    }

    const onCodeChange = (e) => {
        setCurrentItem({ ...currentItem, code: e.target.value })
    }

    const onUsernameChange = (e) => {
        setCurrentItem({ ...currentItem, username: e.target.value })
    }

    const onNicknameChange = (e) => {
        setCurrentItem({ ...currentItem, nickName: e.target.value })
    }

    const onSave = async () => {
        if (currentType === 1) {
            await UserApi.saveUser(currentItem)
        } else {
            await UserApi.updateUser(currentItem)
        }
        setVisible(false)
        init()
        message.success('更新成功')
    }

    const onDelete = async () => {
        await UserApi.delUser(currentItem)
        init()
        message.success('删除成功')
    }

    const init = async () => {
        let users = await UserApi.getAllUsers()
        setUsers(users)
    }

    useEffect(() => {
        init()
    }, [])
    return (
        <div className="user-container">
            <Button type="primary" onClick={savePrize}>添加用户</Button>
            <Table style={{ marginTop: '20px' }} columns={columns} dataSource={users} scroll={{ y: 'calc(100vh - 300px)' }} rowKey="_id" bordered></Table>
            <Modal title={currentType === 1 ? '新增用户' : '编辑用户'} visible={visible} cancelText="取消" okText="确定" onOk={onSave} onCancel={() => setVisible(false)}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal">
                    <Form.Item label="工号">
                        <Input placeholder="请输入" value={currentItem.code} onChange={(e) => onCodeChange(e)}></Input>
                    </Form.Item>
                    <Form.Item label="姓名">
                        <Input placeholder="请输入" value={currentItem.username} onChange={(e) => onUsernameChange(e)}></Input>
                    </Form.Item>
                    <Form.Item label="花名">
                    <Input placeholder="请输入" value={currentItem.nickName} onChange={(e) => onNicknameChange(e)}></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default User
