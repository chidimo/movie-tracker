import { useCallback, useEffect, useState } from 'react'
import { CustomInput } from '../form-elements/custom-input'
import { useSeriesTracker } from '@/context/series-tracker-context'

export const SetupNotificationLeadDays = () => {
  const { state, setNotification } = useSeriesTracker()
  const [value, setValue] = useState((state.notificationDay ?? 2).toString())

  useEffect(() => {
    setValue((state.notificationDay ?? 2).toString())
  }, [state.notificationDay])

  const onBlur = useCallback(() => {
    const parsed = Number.parseInt(value, 10)
    const next = Number.isFinite(parsed) ? Math.max(0, Math.min(14, parsed)) : 2
    setValue(next.toString())
    setNotification(next)
  }, [setNotification, value])

  return (
    <CustomInput
      keyboardType="numeric"
      value={value}
      onChangeText={setValue}
      onBlur={onBlur}
      placeholder="2"
    />
  )
}
