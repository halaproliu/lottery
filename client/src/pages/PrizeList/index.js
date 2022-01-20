import React, { useState, useEffect } from 'react'
import { Table, Image, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Upload } from 'antd'
import * as PrizeApi from '@/api/prize'
import { PRIZE_LEVEL } from '@/constant/prize'
import { formatDate } from '@/libs/date'
import { isEmpty } from '@/libs/utils'
import './index.styl'

const { Option } = Select

const PrizeList = () => {
    const [ prizeList, setPrizeList ] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ currentItem, setCurrentItem ] = useState({ title: '', img: '', type: '', count: '' })
    const [ currentType, setCurrentType ] = useState(null)
    const [ state, setState ] = useState({
        title: '',
        type: ''
    })
    const columns = [{
        title: '奖品名称',
        dataIndex: 'title',
        key: 'title',
        render: text => <span style={{ color: '#409eff' }}>{text}</span>
    }, {
        title: '奖品等级',
        dataIndex: 'type',
        key: 'type',
        width: 120,
        render: text => PRIZE_LEVEL[text]
    }, {
        title: '奖品总数',
        dataIndex: 'count',
        key: 'count',
        width: 100
    }, {
        title: '抽取个数',
        dataIndex: 'eachCount',
        key: 'eachCount',
        width: 100
    }, {
        title: '奖品图片',
        dataIndex: 'img',
        key: 'img',
        width: 90,
        render: img => {
            return (
                <Image width={40} height={40} src={img}></Image>
            )
        }
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

    const savePrize = () => {
        setCurrentItem({ title: '', img: '', type: '' })
        setCurrentType(1)
        setVisible(true)
    }

    const importConfig = () => {

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
        const value = typeof e === 'object' ? e.target.value : e
        if (type === 1) {
            setState({ [key]: value })
        } else {
            setCurrentItem({ ...currentItem, [key]: value })
        }
    }

    const onChangePrizeLevel = (e) => {
        setCurrentItem({ ...currentItem, type: e })
    }

    const readerJson = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = (e) => {
                resolve(e.target.result)
            }
        })
    }

    const beforeUpload = async (file) => {
        let result
        const { name } = file
        if (/.json$/.test(name)) {
            result = await readerJson(file)
            try {
                result = JSON.parse(result)
            } catch {
                result = []
            }
            await PrizeApi.saveMultiPrize({ prizes: result })
            init()
            message.success('导入成功')
        }
        return false
    }

    const onSave = async () => {
        if (currentType === 1) {
            await PrizeApi.savePrize(currentItem)
        } else {
            await PrizeApi.updatePrize(currentItem)
        }
        setVisible(false)
        init()
        message.success('更新成功')
    }

    const onDelete = async () => {
        await PrizeApi.delPrize(currentItem)
        init()
        message.success('删除成功')
    }

    const onSearchByParams = async () => {
        let res
        if (!isEmpty(state)) {
            res = await PrizeApi.getPrizeByParams(state) || []
        } else {
            res = await PrizeApi.getAllPrizes() || []
        }
        setPrizeList(res)
    }

    const init = async () => {
        let prizes = await PrizeApi.getAllPrizes()
        setPrizeList(prizes)
    }

    useEffect(() => {
        init()
        document.title = '奖品管理'
    }, [])
    return (
        <div className="prize-container">
            <Form layout="inline" labelCol={{ style: { width: 100 } }} labelWrap={true} className="prize-container-form">
                <Form.Item label="奖品名称">
                    <Select placeholder="请选择" style={{ width: 160 }} value={state.title} onChange={e => onChange(e, 'title', 1)} allowClear>
                        {
                            prizeList.length && prizeList.map((prize) => {
                                return (<Option value={prize.title} key={prize._id}>{prize.title}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="奖品等级">
                    <Select placeholder="请选择" style={{ width: 160 }} value={state.type} onChange={e => onChange(e, 'type', 1)} allowClear>
                        {
                            PRIZE_LEVEL.map((prize, index) => {
                                return (<Option value={index} key={prize}>{prize}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Button type="primary" onClick={onSearchByParams}>查询</Button>
                <Button type="primary" style={{ marginLeft: '10px' }} onClick={savePrize}>添加奖品</Button>
                <Upload accept='.json,.xlsx,.xls,.csv' beforeUpload={beforeUpload}>
                    <Button style={{ marginLeft: '10px' }} type="primary" onClick={importConfig}>导入数据</Button>
                </Upload>
            </Form>
            {/* <div style={{ marginTop: '20px' }}>
                <Button type="primary" onClick={savePrize}>添加奖品</Button>
                <Upload accept='.json,.xlsx,.xls,.csv' beforeUpload={beforeUpload}>
                    <Button style={{ marginLeft: '10px' }} type="primary" onClick={importConfig}>导入数据</Button>
                </Upload>
            </div> */}
            <Table style={{ marginTop: '20px' }} columns={columns} dataSource={prizeList} scroll={{ y: 'calc(100vh - 340px)' }} rowKey="_id" bordered></Table>
            <Modal title={currentType === 1 ? '新增奖品' : '编辑奖品'} visible={visible} cancelText="取消" okText="确定" onOk={onSave} onCancel={() => setVisible(false)}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal">
                    <Form.Item label="奖品名称">
                        <Input placeholder="请输入" value={currentItem.title} onChange={(e) => onChange(e, 'title')}></Input>
                    </Form.Item>
                    <Form.Item label="奖品图片">
                        <Input placeholder="请输入" value={currentItem.img} onChange={(e) => onChange(e, 'img')}></Input>
                    </Form.Item>
                    <Form.Item label="抽取总数">
                        <Input placeholder="请输入" value={currentItem.count} onChange={(e) => onChange(e, 'count')}></Input>
                    </Form.Item>
                    <Form.Item label="抽取个数">
                        <Input placeholder="请输入" value={currentItem.eachCount} onChange={(e) => onChange(e, 'eachCount')}></Input>
                    </Form.Item>
                    <Form.Item label="奖品等级">
                        <Select value={currentItem.type} onChange={(e) => onChangePrizeLevel(e)}>
                            {
                                PRIZE_LEVEL.map((prize, index) => {
                                    return (<Option value={index} key={prize}>{ prize }</Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default PrizeList
