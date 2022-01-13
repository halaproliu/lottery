import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import './index.styl'

function MySelect (props) {
    const options = props.options
    const labelKey = props.labelKey || 'label'
    const valueKey = props.valueKey || 'value'
    const idKey = props.idKey || 'id'
    const placeholder = props.placeholder || '请选择'
    const currentValue = props.currentValue || ''
    const onChange = props.onChange
    const [ hoverIndex, setHoverIndex ] = useState(null)
    const [ openSelect, setOpenSelect ] = useState(false)
    const ref = useRef(null)

    const onSelect = (e, val, index) => {
        setOpenSelect(false)
        typeof onChange === 'function' && onChange(val, index)
    }

    const onInputClick = (e) => {
        // 阻止冒泡
        e.nativeEvent.stopImmediatePropagation()
        if (!openSelect) {
            setOpenSelect(true)
        } else {
            setOpenSelect(false)
        }
    }

    const onMouseEnter = (index) => {
        setHoverIndex(index)
    }

    const onSelectComponentClick = (e) => {
        e.nativeEvent.stopImmediatePropagation()
    }

    useEffect(() => {
        document.addEventListener('click', (e) => {
            e = e || window.event
            const target = e.target
            if (!ref.current.contains(target) && target !== ref.current) {
                setOpenSelect(false)
            }
            // const classList = e.target.classList
            // const classes = ['dropdown-item', 'custom-select__input', 'custom-select__dropdown', 'custom-select__inner', 'custom-select__suffix', 'custom-select__icon']
            // let isContains = classes.reduce((prev, next) => {
            //     return prev || classList.contains(next)
            // }, false)
            // if (!isContains) {
            //     setOpenSelect(false)
            // }
        })
    }, [])
    return (
        <div ref={ref} className="custom-select" onClick={onSelectComponentClick}>
            <div className="custom-select__inner">
                <input type="text" placeholder={placeholder} readOnly={true} value={currentValue} onClick={onInputClick} className={classNames("custom-select__input", { "is-hover": openSelect })} />
                <span className="custom-select__suffix">
                    <i className={classNames("custom-select__icon fa", { "fa-angle-down": !openSelect, "fa-angle-up": openSelect })} aria-hidden="true"></i>
                </span>
            </div>
            <ul className={classNames("custom-select__dropdown", { "is-hidden": !openSelect })}>
                {
                    options.map((option, index) => {
                        return (
                            <li className={classNames("dropdown-item", { "hover": hoverIndex === index })} onMouseEnter={() => onMouseEnter(index)} onClick={(e) => onSelect(e, option[valueKey], index)} key={option[idKey]}>
                                <span>{ option[labelKey] }</span>
                            </li>
                        )
                    })
                }
                <div className="custom-select__arrow"></div>
            </ul>
        </div>
    )
}

export default MySelect
