import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select } from 'antd'
import * as WinnerUserApi from '@/api/winnerUser'
import * as PrizeApi from '@/api/prize'
import { formatDate } from '@/libs/date'
import { isEmpty } from '@/libs/utils'
import { PRIZE_LEVEL } from '@/constant/prize'

const { Option } = Select

const WinnerUsers = () => {
    const [ users, setUsers ] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ currentItem, setCurrentItem ] = useState({ code: '', username: '', nickName: '' })
    const [ currentType, setCurrentType ] = useState(null)
    const [ prizes, setPrizes ] = useState([])
    const [ state, setState ] = useState({
        prizeType: '',
        title: '',
        nickName: '',
        username: '',
        code: ''
    })
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
        title: '奖品名称',
        dataIndex: 'title',
        key: 'title',
        width: 120,
        render: text => <span style={{ color: '#409eff' }}>{text}</span>
    }, {
        title: '奖品等级',
        dataIndex: 'type',
        key: 'type',
        width: 120,
        render: text => PRIZE_LEVEL[text]
    }, {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        render: time => formatDate(new Date(time), 'yyyy-MM-dd'),
        width: 120
    }, {
        title: '修改时间',
        dataIndex: 'updateAt',
        key: 'updateAt',
        render: time => formatDate(new Date(time), 'yyyy-MM-dd'),
        width: 120
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

    const editColumn = (item) => {
        setCurrentItem(item)
        setCurrentType(2)
        setVisible(true)
    }

    const delColumn = async (item) => {
        setCurrentItem(item)
    }

    const onChange = (e, key, type) => {
        const value = typeof e === 'object' ? e.target.value : e
        if (type === 1) {
            setState({ [key]: value })
        } else {
            setCurrentItem({ ...currentItem, [key]: value })
        }
    }

    const onSave = async () => {
        if (currentType === 1) {
            await WinnerUserApi.saveWinnerUser(currentItem)
        } else {
            await WinnerUserApi.updateWinnerUser(currentItem)
        }
        setVisible(false)
        init()
        message.success('更新成功')
    }

    const onDelete = async () => {
        await WinnerUserApi.delWinnerUser(currentItem)
        init()
        message.success('删除成功')
    }

    const onSearchByParams = async () => {
        let res
        if (!isEmpty(state)) {
            res = await WinnerUserApi.getWinnerUsersByParams(state) || []
        } else {
            res = await WinnerUserApi.getAllWinnerUsers() || []
        }
        setUsers(res)
    }

    const init = async () => {
        let users = await WinnerUserApi.getAllWinnerUsers()
        let prizes = await PrizeApi.getAllPrizes()
        setUsers(users)
        setPrizes(prizes)
    }

    useEffect(() => {
        init()
    }, [])
    return (
        <div className="user-container">
            <Form layout="inline">
                <Form.Item label="奖品名称">
                    <Select placeholder="请选择" value={state.title} style={{ width: '160px' }} onChange={e => onChange(e, 'title', 1)} allowClear>
                        {
                            prizes.length && prizes.map((prize) => {
                                return (<Option value={prize.title} key={prize._id}>{prize.title}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="奖品等级">
                    <Select placeholder="请选择" value={state.type} style={{ width: '160px' }} onChange={e => onChange(e, 'type', 1)} allowClear>
                        {
                            PRIZE_LEVEL.map((prize, index) => {
                                return (<Option value={index} key={prize}>{prize}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="工号">
                    <Input placeholder="请输入" value={state.code} onChange={e => onChange(e, 'code', 1)}></Input>
                </Form.Item>
                <Form.Item label="姓名">
                    <Input placeholder="请输入" value={state.username} onChange={e => onChange(e, 'username', 1)}></Input>
                </Form.Item>
                <Form.Item label="花名">
                    <Input placeholder="请输入" value={state.nickName} onChange={e => onChange(e, 'nickName', 1)}></Input>
                </Form.Item>
                <Button type="primary" onClick={onSearchByParams}>查询</Button>
            </Form>
            <Table style={{ marginTop: '20px' }} columns={columns} dataSource={users} scroll={{ y: 'calc(100vh - 300px)' }} rowKey="_id" bordered></Table>
            <Modal title={currentType === 1 ? '新增用户' : '编辑用户'} visible={visible} cancelText="取消" okText="确定" onOk={onSave} onCancel={() => setVisible(false)}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal">
                    <Form.Item label="工号">
                        <Input placeholder="请输入" value={currentItem.code} onChange={(e) => onChange(e, 'code')}></Input>
                    </Form.Item>
                    <Form.Item label="姓名">
                        <Input placeholder="请输入" value={currentItem.username} onChange={(e) => onChange(e, 'username')}></Input>
                    </Form.Item>
                    <Form.Item label="花名">
                    <Input placeholder="请输入" value={currentItem.nickName} onChange={(e) => onChange(e, 'nickName')}></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default WinnerUsers
