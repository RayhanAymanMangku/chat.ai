"use client"
import { useState, useEffect } from "react"

interface MainPageTypeWritingProps {
    fullText: string
    descText: string
}

const MainPageTypeWriting = ({ fullText, descText }: MainPageTypeWritingProps) => {
    const [displayHeading, setDisplayHeading] = useState("")
    const [displayDesc, setDisplayDesc] = useState("")
    const [headingIndex, setHeadingIndex] = useState(0)
    const [descIndex, setDescIndex] = useState(0)
    const [headingComplete, setHeadingComplete] = useState(false)

    useEffect(() => {
        if (headingIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayHeading((prev) => prev + fullText[headingIndex])
                setHeadingIndex((prev) => prev + 1)
            }, 100)
            return () => clearTimeout(timeout)
        } else {
            setHeadingComplete(true)
        }
    }, [headingIndex, fullText])

    useEffect(() => {
        if (headingComplete && descIndex < descText.length) {
            const timeout = setTimeout(() => {
                setDisplayDesc((prev) => prev + descText[descIndex])
                setDescIndex((prev) => prev + 1)
            }, 50)
            return () => clearTimeout(timeout)
        }
    }, [descIndex, descText, headingComplete])

    return (
        <div className="flex flex-col w-full justify-center p-10">
            <h1 className="text-3xl text-white text-center">
                {displayHeading}
                {headingIndex < fullText.length && <span className="animate-pulse">|</span>}
            </h1>
            <p className="text-xl text-white mt-4 lg:text-justify text-center text-wrap">
                {displayDesc}
                {headingComplete && descIndex < descText.length && <span className="animate-pulse">|</span>}
            </p>
        </div>
    )
}

export default MainPageTypeWriting

