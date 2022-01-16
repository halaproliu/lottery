import React, { useState, useEffect } from 'react'
import { Table, Image, Button, Space, Modal, Form, Input, message, Popconfirm, Select } from 'antd'
import * as PrizeApi from '@/api/prize'
import { PRIZE_LEVEL } from '@/constant/prize'
import { formatDate } from '@/libs/date'
import './index.styl'

const { Option } = Select

const PrizeList = () => {
    const [ prizeList, setPrizeList ] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ currentItem, setCurrentItem ] = useState({ title: '', img: '', type: '' })
    const [ currentType, setCurrentType ] = useState(null)
    const columns = [{
        title: '奖品名称',
        dataIndex: 'title',
        key: 'title'
    }, {
        title: '奖品等级',
        dataIndex: 'type',
        key: 'type',
        width: 120,
        render: text => PRIZE_LEVEL[text]
    }, {
        title: '抽取个数',
        dataIndex: 'eachCount',
        key: 'eachCount',
        width: 120
    }, {
        title: '奖品图片',
        dataIndex: 'img',
        key: 'img',
        width: 120,
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

    const editColumn = (item) => {
        setCurrentItem(item)
        setCurrentType(2)
        setVisible(true)
    }

    const delColumn = async (item) => {
        setCurrentItem(item)
    }

    const onTitleChange = (e) => {
        setCurrentItem({ ...currentItem, title: e.target.value })
    }

    const onImgChange = (e) => {
        setCurrentItem({ ...currentItem, img: e.target.value })
    }

    const onEachCountChange = (e) => {
        setCurrentItem({ ...currentItem, eachCount: e.target.value })
    }

    const onChangePrizeLevel = (e) => {
        setCurrentItem({ ...currentItem, type: e })
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

    const init = async () => {
        let prizes = await PrizeApi.getAllPrizes()
        setPrizeList(prizes)
    }

    useEffect(() => {
        init()
    }, [])
    return (
        <div className="prize-container">
            <Button type="primary" onClick={savePrize}>添加奖品</Button>
            <Table style={{ marginTop: '20px' }} columns={columns} dataSource={prizeList} scroll={{ y: 'calc(100vh - 300px)' }} rowKey="_id" bordered></Table>
            <Modal title={currentType === 1 ? '新增奖品' : '编辑奖品'} visible={visible} cancelText="取消" okText="确定" onOk={onSave} onCancel={() => setVisible(false)}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal">
                    <Form.Item label="奖品名称">
                        <Input placeholder="请输入" value={currentItem.title} onChange={(e) => onTitleChange(e)}></Input>
                    </Form.Item>
                    <Form.Item label="奖品图片">
                        <Input placeholder="请输入" value={currentItem.img} onChange={(e) => onImgChange(e)}></Input>
                    </Form.Item>
                    <Form.Item label="抽取个数">
                        <Input placeholder="请输入" value={currentItem.eachCount} onChange={(e) => onEachCountChange(e)}></Input>
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
