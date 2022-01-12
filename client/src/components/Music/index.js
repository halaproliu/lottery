import React, { useState, useRef, useEffect } from 'react'
import music from '@/assets/music/music.mp3'
import './index.styl'

let stopAnimate = false
function Music () {
    let [ musicStyle, setMusicStyle ] = useState({})
    let [ rotated, setRotated ] = useState(0)
    const audioRef = useRef(null)
    const animateFn = () => {
        window.requestAnimationFrame(() => {
            if (stopAnimate) return
            setMusicStyle({
                transform: `rotate(${rotated % 360}deg)`
            })
            setRotated(++rotated)
            animateFn()
        })
    }
    const onMusicPlay = () => {
        let audio = audioRef.current
        if (audio.paused) {
            audio.play().then(_ => {
                stopAnimate = false
                animateFn()
            }).catch(e => {
                console.log(e)
            })
        } else {
            audio.pause()
            stopAnimate = true
        }
    }

    useEffect(() => {
        // audioRef.current.play()
    }, [])

    return (
        <div className="lottery-music">
            <audio ref={audioRef} className="lottery-music__item" src={music}></audio>
            <div className="lottery-music__box" style={musicStyle} onClick={onMusicPlay}>Music</div>
        </div>
    )
}

export default Music
