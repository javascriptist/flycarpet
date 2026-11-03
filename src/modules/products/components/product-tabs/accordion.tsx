import { Text, clx } from "@medusajs/ui"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
  complete?: boolean
  active?: boolean
  triggerable?: boolean
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionPrimitive.AccordionSingleProps &
      React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
      React.RefAttributes<HTMLDivElement>)

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  triggerable,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clx("group border-b border-line", className)}
    >
      <AccordionPrimitive.Header>
        {/* The whole row is the trigger — a big, easy target */}
        <AccordionPrimitive.Trigger className="no-press flex w-full items-center justify-between gap-4 py-4 text-left">
          <span className="flex flex-col">
            <span className="text-headline text-ink">{title}</span>
            {subtitle && <span className="text-footnote text-ink-muted">{subtitle}</span>}
          </span>
          {customTrigger || <MorphingTrigger />}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className="overflow-hidden radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open"
      >
        <div className="pb-5">
          {description && <Text>{description}</Text>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => (
  <span className="relative h-5 w-5 shrink-0 text-ink-muted" aria-hidden>
    <span className="absolute left-1/2 top-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
    <span className="absolute left-1/2 top-1/2 h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition duration-200 group-radix-state-open:rotate-90 group-radix-state-open:opacity-0" />
  </span>
)

export default Accordion
