import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { X } from 'lucide-react'

interface CardHistoryProps {
    historyTitle: string
    historyData: string
    date: string
    time: string
}

const CardHistory = ({ historyTitle, historyData, date, time }: CardHistoryProps) => {
    return (
        <Card className='bg-white'>
            <CardHeader className='border-b flex flex-row justify-between'>
                <CardTitle className='cursor-pointer'>{historyTitle}</CardTitle>
                <X className="text-foreground hover:text-foreground/20 transition-all duration-300" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    <div className=" flex">
                        <CardDescription>{historyData}</CardDescription>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm">{date}</p>
                        <p className="text-sm">{time}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CardHistory