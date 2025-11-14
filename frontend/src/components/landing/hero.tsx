import { Button } from "@/components/ui/button-extended"
import { cn } from "@/lib/utils"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            The Universal Skill School
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Unlock your potential with our decentralized learning platform. Learn, earn, and grow with blockchain-powered education.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/app"
              className={cn(
                "rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm",
                "hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              )}
            >
              <GraduationCap className="mr-2 inline h-4 w-4" />
              Launch Learning Platform
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#6366f1] to-[#a855f7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}
