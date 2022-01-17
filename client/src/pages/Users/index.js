import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd'
import * as UserApi from '@/api/user'
import { formatDate } from '@/libs/date'
import { isEmpty } from '@/libs/utils'
import './index.styl'

const User = () => {
    const [ users, setUsers ] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ currentItem, setCurrentItem ] = useState({ code: '', username: '', nickName: '' })
    const [ currentType, setCurrentType ] = useState(null)
    const [ state, setState ] = useState({ nickName: '', username: '', code: ''})
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
        width: 120,
        render: text => <span style={{ color: '#409eff' }}>{text}</span>
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
                        okText="确认"
                        cancelText="取消"
                        onConfirm={onDelete}>
                        <Button type="primary" danger={true} onClick={() => delColumn(item)}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    }]

    const saveUser = () => {
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

    const onChange = (e, key, type) => {
        const value = e.target.value
        if (type === 1) {
            setState({ [key]: value })
        } else {
            setCurrentItem({ ...currentItem, [key]: value })
        }
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

    const getUserByParams = async () => {
        let opts = {}, users = []
        Object.keys(state).forEach(key => {
            state[key] && (opts[key] =  state[key])
        })
        if (!isEmpty(opts)) {
            users = await UserApi.getUserByParams(opts) || []
        } else {
            users = await UserApi.getAllUsers() || []
        }
        setUsers(users)
    }

    const init = async () => {
        let users = await UserApi.getAllUsers() || []
        setUsers(users)
    }

    useEffect(() => {
        init()
        document.title = '用户管理'
    }, [])
    return (
        <div className="user-container">
            <Form
                labelCol={{ span: 4 }}
                layout="inline">
                <Form.Item label="工号">
                    <Input placeholder="请输入" value={state.code} onChange={e => onChange(e, 'code', 1)}></Input>
                </Form.Item>
                <Form.Item label="姓名">
                    <Input placeholder="请输入" value={state.username} onChange={e => onChange(e, 'username', 1)}></Input>
                </Form.Item>
                <Form.Item label="花名">
                    <Input placeholder="请输入" value={state.nickName} onChange={e => onChange(e, 'nickName', 1)}></Input>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={getUserByParams}>查询</Button>
                </Form.Item>
            </Form>
            <Button style={{ marginTop: '20px' }} type="primary" onClick={saveUser}>添加用户</Button>
            <Table style={{ marginTop: '20px' }} columns={columns} dataSource={users} scroll={{ y: 'calc(100vh - 300px)' }} rowKey="_id" bordered></Table>
            <Modal title={currentType === 1 ? '新增用户' : '编辑用户'} visible={visible} cancelText="取消" okText="确定" onOk={onSave} onCancel={() => setVisible(false)}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal">
                    <Form.Item label="工号">
                        <Input placeholder="请输入" value={currentItem.code} onChange={(e) => onChange(e, 'code', 1)}></Input>
                    </Form.Item>
                    <Form.Item label="姓名">
                        <Input placeholder="请输入" value={currentItem.username} onChange={(e) => onChange(e, 'username', 1)}></Input>
                    </Form.Item>
                    <Form.Item label="花名">
                    <Input placeholder="请输入" value={currentItem.nickName} onChange={(e) => onChange(e, 'nickName', 1)}></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default User
