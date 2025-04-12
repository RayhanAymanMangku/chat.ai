import { X } from 'lucide-react'
import React from 'react'

interface CardHistoryProps {
    title: string
    date: string
    isActive: boolean
    onClick: () => void
    onDelete: () => void
}

const CardHistory = ({ title, isActive, onClick, onDelete }: CardHistoryProps) => {
    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-lg cursor-pointer border border-foreground transition-colors ${isActive
                ? 'bg-primary text-white border-0.5 border-white'
                : 'bg-background hover:bg-primary text-white'
                }`}
        >
            <div className="flex flex-row justify-between">
                <p className="truncate">{title}</p>
                <X className="text-gray-500 hover:text-red-500 transition-all duration-300" size={16} onClick={onDelete} />
            </div>
        </div>
    )
}

export default CardHistory