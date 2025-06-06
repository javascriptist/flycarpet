import InteractiveLink from "@modules/common/components/interactive-link"
import { Metadata } from "next"
import Image from "next/image"
export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <Image
        src="/images/nofound.jpg"
        alt="404"
        width={300}
        height={300}
        className="w-[300px] h-[300px] object-contain"
      />
      <h1 className="text-2xl-semi text-ui-fg-base">Page not found</h1>
      <p className="text-small-regular text-ui-fg-base">
        The page you tried to access does not exist.
      </p>
      <InteractiveLink href="/">Go to frontpage</InteractiveLink>
    </div>
  )
}
