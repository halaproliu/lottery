import { useState, useCallback } from "react"

const useLoading = (req) => {
    const [ loading, setLoading ] = useState(false)
    const wrapperReq = useCallback(
        (...args) => {
            setLoading(true)
            return req(...args).then(data => {
                setLoading(false)
                return Promise.resolve(data)
            }).catch(err => {
                setLoading(false)
                return Promise.reject(err)
            })
        },
        [req]
    )

    return [loading, wrapperReq]
}

export default useLoading

