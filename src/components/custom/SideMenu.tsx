import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
// import CardHistory from './CardHistory'

type PropType = {
    isOpen: boolean
    onOpenChange?: () => void
}
const SideMenu = ({ isOpen, onOpenChange }: PropType) => {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className='bg-foreground/20 p-4'>
                <SheetHeader className='border-b border-b-foreground'>
                    <SheetTitle className='text-white text-xl'>History</SheetTitle>
                </SheetHeader>
                <div className='overflow-y-scroll space-y-4'>
                    <h1 className='text-muted-foreground'>Now is beta version, we will add more features soon.</h1>
                    {/* <CardHistory historyTitle='Chat with AI' historyData='Hello' date='2021-10-10' time='10:10' />
                    <CardHistory historyTitle='Chat with AI' historyData='Hello' date='2021-10-10' time='10:10' />
                    <CardHistory historyTitle='Chat with AI' historyData='Hello' date='2021-10-10' time='10:10' />
                    <CardHistory historyTitle='Chat with AI' historyData='Hello' date='2021-10-10' time='10:10' />
                    <CardHistory historyTitle='Chat with AI' historyData='Hello' date='2021-10-10' time='10:10' />
                    <CardHistory historyTitle='Chat with AI' historyData='Hello' date='2021-10-10' time='10:10' />
                    <CardHistory historyTitle='Chat with AI' historyData='Hello' date='2021-10-10' time='10:10' /> */}
                </div>
            </SheetContent>
        </Sheet>

    )
}

export default SideMenu