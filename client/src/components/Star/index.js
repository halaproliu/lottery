import React, { useRef, useEffect } from 'react'
import '@/assets/css/animate.min.css'
import Stars from '@/libs/Star'
import './index.styl'

function Star () {
    let stars = useRef(null)
    const init = () => {
        stars.current = new Stars(canvasRef.current)
        stars.current.init()
    }
    useEffect(() => {
        init()
        window.addEventListener('resize', init, false)
        return () => {
            window.removeEventListener('resize', init, false)
            stars.current.stopAnimate()
        }
    }, [])
    const canvasRef = useRef(null)
    return (
        <div className="canvas-box">
            <canvas id="canvas" width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
        </div>
    )
}

export default Star
