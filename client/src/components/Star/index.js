import React, { useRef, useEffect } from 'react'
import '@/assets/css/animate.min.css'
import Stars from '@/libs/Star'
import './index.styl'

function Star () {
    const init = () => {
        let stars = new Stars(canvasRef.current)
        stars.init()
    }
    useEffect(() => {
        init()
        window.addEventListener('resize', init, false)
        return () => {
            window.removeEventListener('resize', init, false)
        }
    }, [])
    const canvasRef = useRef(null)
    return (
        <div className="canvas-box">
            <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
    )
}

export default Star
