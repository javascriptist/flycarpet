import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"
import Image from "next/image"
export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <Image
              src="/nofound.jpg"
              alt="404"
              width={400}
              height={300}
              className="w-[400px] h-[300px] object-cover rounded-xl border border-[#FF6A1A] mb-4"
            />
      <h1 className="text-2xl-semi text-ui-fg-base">Page not found</h1>
      <p className="text-small-regular text-ui-fg-base">
        The cart you tried to access does not exist. Clear your cookies and try
        again.
      </p>
      <InteractiveLink href="/">Go to frontpage</InteractiveLink>
    </div>
  )
}
