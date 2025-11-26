import { clx } from "@medusajs/ui"

type Props = {
  className?: string
}

export default function Divider({ className }: Props) {
  return <div className={clx("h-px w-full border-b border-gray-200", className)} />
}
