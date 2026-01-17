import { Description, Field, Label, Switch } from '@headlessui/react'

interface Props {
  label?: string
  description?: string
  disabled?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export const Switcher = ({
  label,
  description,
  disabled,
  checked,
  onChange,
}: Props) => {
  return (
    <Field disabled={disabled} className="">
      <div className="flex items-center justify-between gap-1">
        {label ? (
          <Label className="data-disabled:opacity-50">{label}</Label>
        ) : null}
        <Switch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600 data-disabled:cursor-not-allowed data-disabled:opacity-50"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </div>
      {description ? (
        <Description className="data-disabled:opacity-50">
          {description}
        </Description>
      ) : null}
    </Field>
  )
}
