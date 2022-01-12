import React, { useState } from 'react'
import classNames from 'classnames'
import './index.styl'

function MySelect (props) {
    const options = props.options
    const labelKey = props.labelKey || 'label'
    const valueKey = props.valueKey || 'value'
    const idKey = props.idKey || 'id'
    const onChange = props.onChange
    const [ hoverIndex, setHoverIndex ] = useState(null)
    const [ openSelect, setOpenSelect ] = useState(false)
    const [ value, setValue ] = useState('')

    const onSelect = (val, index) => {
        console.log(val, index)
        setValue(val)
        typeof onChange === 'function' && onChange(val, index)
    }

    const onFocus = () => {
        setOpenSelect(true)
    }
    const onBlur = () => {
        setOpenSelect(false)
    }

    const onMouseEnter = (index) => {
        setHoverIndex(index)
    }
    return (
        <div className="custom-select">
            <input type="text" readOnly={true} value={value} onFocus={onFocus} onBlur={onBlur} className={classNames("custom-select__inner", { "is-hover": openSelect })} />
            {/* <div className="custom-select__inner"></div> */}
            <ul className="custom-select__dropdown" style={{ display: openSelect ? 'block': 'none' }}>
                {
                    options.map((option, index) => {
                        return (
                            <li className={classNames("dropdown-item", { "hover": hoverIndex === index })} onMouseEnter={() => onMouseEnter(index)} onClick={() => onSelect(option[valueKey], index)} key={option[idKey]}>
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
