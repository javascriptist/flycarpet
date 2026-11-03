"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { tUi } from "@lib/util/ui-strings"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountInfo = ({
  label: labelProp,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  'data-testid': dataTestid
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  const countryCode = useParams()?.countryCode as string | undefined
  const label = tUi(labelProp, countryCode)

  return (
    <div className="py-5" data-testid={dataTestid}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-footnote text-ink-muted">{label}</span>
          <div className="text-callout text-ink">
            {typeof currentInfo === "string" ? (
              <span data-testid="current-info">{tUi(currentInfo, countryCode)}</span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <button
          type={state ? "reset" : "button"}
          onClick={handleToggle}
          className="no-press shrink-0 text-callout font-medium text-brand-accent-strong hover:underline"
          data-testid="edit-button"
          data-active={state}
        >
          {state ? tUi("Cancel", countryCode) : tUi("Edit", countryCode)}
        </button>
      </div>

      {isSuccess && (
        <p className="mt-3 text-footnote text-green-700" role="status" data-testid="success-message">
          ✓ {label} {tUi("updated succesfully", countryCode)}
        </p>
      )}
      {isError && (
        <p className="mt-3 text-footnote text-red-700" role="alert" data-testid="error-message">
          {errorMessage}
        </p>
      )}

      {state && (
        <div className="flex flex-col gap-y-3 pt-4">
          <div>{children}</div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="btn-primary h-11 w-full small:w-auto"
              data-testid="save-button"
            >
              {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />}
              {tUi("Save changes", countryCode)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountInfo
