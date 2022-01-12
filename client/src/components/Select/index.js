import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import './index.styl'

function MySelect (props) {
    const options = props.options
    const labelKey = props.labelKey || 'label'
    const valueKey = props.valueKey || 'value'
    const idKey = props.idKey || 'id'
    const placeholder = props.placeholder || '请选择'
    const onChange = props.onChange
    const [ hoverIndex, setHoverIndex ] = useState(null)
    const [ openSelect, setOpenSelect ] = useState(false)
    const [ value, setValue ] = useState('')

    const onSelect = (e, val, index) => {
        setValue(val)
        setOpenSelect(false)
        typeof onChange === 'function' && onChange(val, index)
    }

    const onFocus = (e) => {
        // 阻止冒泡
        e.nativeEvent.stopImmediatePropagation()
        setOpenSelect(true)
    }

    const onMouseEnter = (index) => {
        console.log()
        setHoverIndex(index)
    }

    useEffect(() => {
        document.addEventListener('click', (e) => {
            const classList = e.target.classList
            console.log(classList)
            const classes = ['dropdown-item', 'custom-select__input', 'custom-select__dropdown', 'custom-select__inner', 'custom-select__suffix', 'custom-select__icon']
            // const isContains = classList.contains('dropdown-item') || classList.contains('custom-select__dropdown') || classList.contains('custom-select__inner')
            let isContains = classes.reduce((prev, next) => {
                return classList.contains(prev) || classList.contains(next)
            })
            if (!isContains) {
                setOpenSelect(false)
            }
        })
    }, [])
    return (
        <div className="custom-select">
            <div className="custom-select__inner">
                <input type="text" placeholder={placeholder} readOnly={true} value={value} onFocus={onFocus} className={classNames("custom-select__input", { "is-hover": openSelect })} />
                <span className="custom-select__suffix">
                    <i className="custom-select__icon fa fa-angle-down" aria-hidden="true"></i>
                </span>
            </div>
            <ul className="custom-select__dropdown" style={{ display: openSelect ? 'block': 'none' }}>
                {
                    options.map((option, index) => {
                        return (
                            <li className={classNames("dropdown-item", { "hover": hoverIndex === index })} onMouseEnter={() => onMouseEnter(index)} onClick={(e) => onSelect(e, option[valueKey], index)} key={option[idKey]}>
                                <span>{ option[labelKey] }</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default MySelect
