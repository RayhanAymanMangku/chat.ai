import MainPageTypeWriting from "@/components/custom/MainPageTypeWriting"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const Page = () => {

    return (
        <main className="flex flex-col">
            <div className="flex w-full justify-center py-8">
                <Image src="/assets/chatai.png" width={100} height={100} alt="logo" />
            </div>
            <div className="w-fit mx-auto flex">
                <MainPageTypeWriting fullText="Welcome to chat.ai" descText="Ask your needs with chat ai which uses technology from gemini ai." />
            </div>
            <div className="flex items-center justify-center py-8">
                <Link href="/chat">
                    <Button className="bg-white text-foreground rounded-full transition-all duration-300 hover:text-white">Let&apos;s Start</Button>
                </Link>
            </div>
        </main>
    )
}

export default Page

