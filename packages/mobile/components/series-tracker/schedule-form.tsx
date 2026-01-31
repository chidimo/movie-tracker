import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Platform, StyleSheet, View } from 'react-native'
import { CustomButton } from '../form-elements/custom-button'
import { CustomInput } from '../form-elements/custom-input'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'
import type { Show } from '@movie-tracker/core'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useSeriesTracker } from '@/context/series-tracker-context'

type ScheduleFormType = {
  date: string
  target: string
  frequency: number
}

export const ScheduleForm = ({
  show,
  onClose,
}: {
  show: Show
  onClose: () => void
}) => {
  const { updateShow } = useSeriesTracker()
  const { border: borderColor } = useThemeColor({}, ['border'])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempDate, setTempDate] = useState(new Date())

  const baseline = show.tentativeNextEpisode

  const defaultValues = {
    date: show.tentativeNextAirDate
      ? show.tentativeNextAirDate.substring(0, 10)
      : '',
    frequency: show.tentativeFrequencyDays || 7,
    target: baseline
      ? `s${baseline.seasonNumber}-e${baseline.episodeNumber}`
      : '',
  }

  const mostRecentSeasonNumber = useMemo(() => {
    const nums = (show?.seasons || [])
      .map((s) => s.seasonNumber)
      .filter((n): n is number => typeof n === 'number')

    return nums.length ? Math.max(...nums) : undefined
  }, [show])

  const allEpisodesFlat = useMemo(() => {
    if (!show || typeof mostRecentSeasonNumber !== 'number') return []

    const season = (show.seasons || []).find(
      (s) => s.seasonNumber === mostRecentSeasonNumber,
    )
    if (!season) return []

    return [...(season.episodes || [])]
      .filter((e) => typeof e.episodeNumber === 'number')
      .sort((a, b) => (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0))
      .map((e) => ({
        seasonNumber: mostRecentSeasonNumber,
        episodeNumber: e.episodeNumber || 0,
        title: e.title,
      }))
  }, [show, mostRecentSeasonNumber])

  const { control, handleSubmit } = useForm<ScheduleFormType>({
    defaultValues,
    reValidateMode: 'onChange',
    values: defaultValues,
    mode: 'onSubmit',
  })

  const onSubmit = handleSubmit(async ({ date, target, frequency }) => {
    if (!show || !date || !target) {
      onClose()
      return
    }

    const [sStr, eStr] = target.split('-')
    const seasonNumber = Number(sStr.replace('s', ''))
    const episodeNumber = Number(eStr.replace('e', ''))

    const updated: Show = {
      ...show,
      tentativeNextAirDate: new Date(date).toISOString(),
      tentativeNextEpisode: { seasonNumber, episodeNumber },
      tentativeFrequencyDays: Math.max(
        1,
        Number.isFinite(frequency) ? frequency : 7,
      ),
    }

    updateShow(updated)
    onClose()
  })

  return (
    <ThemedView style={styles.form}>
      {/* Date */}
      <ThemedView>
        <ThemedText style={styles.label}>Date</ThemedText>
        <Controller
          control={control}
          name="date"
          rules={{ required: 'Date is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <CustomButton
                title={
                  value
                    ? new Date(value).toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Select Date'
                }
                variant="SECONDARY"
                onPress={() => {
                  setTempDate(value ? new Date(value) : new Date())
                  setShowDatePicker(true)
                }}
                containerStyle={[
                  styles.dateButton,
                  { alignSelf: 'flex-start' },
                ]}
                textStyle={{ alignItems: 'flex-start' }}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false)
                    if (event.type === 'set' && selectedDate) {
                      const dateString = selectedDate
                        .toISOString()
                        .substring(0, 10)
                      onChange(dateString)
                    }
                  }}
                />
              )}
              {error?.message && (
                <ThemedText style={styles.errorText}>
                  {error.message}
                </ThemedText>
              )}
            </View>
          )}
        />
      </ThemedView>

      {/* Episode */}
      <ThemedView>
        <ThemedText style={styles.label}>Episode</ThemedText>
        <View style={[styles.pickerWrapper, { borderColor }]}>
          <Controller
            control={control}
            name="target"
            rules={{ required: 'Episode is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Select episode" value="" />
                {allEpisodesFlat.map((ep) => (
                  <Picker.Item
                    key={`s${ep.seasonNumber}-e${ep.episodeNumber}`}
                    value={`s${ep.seasonNumber}-e${ep.episodeNumber}`}
                    label={`Season ${ep.seasonNumber} · E${ep.episodeNumber} · ${ep.title}`}
                  />
                ))}
              </Picker>
            )}
          />
        </View>
      </ThemedView>

      {/* Frequency */}
      <ThemedView>
        <Controller
          control={control}
          name="frequency"
          rules={{ required: 'Frequency is required' }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <CustomInput
              value={value?.toString()}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Frequency (days)"
              label="Frequency (days)"
              returnKeyType="done"
              error={error?.message}
              onSubmitEditing={onSubmit}
            />
          )}
        />
      </ThemedView>

      <ThemedView style={styles.actions}>
        <CustomButton
          title="Cancel"
          variant="CANCEL"
          onPress={onClose}
          containerStyle={{ width: '45%' }}
        />
        <CustomButton
          title="Save"
          variant="PRIMARY"
          onPress={onSubmit}
          containerStyle={{ width: '45%' }}
        />
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateButton: {
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 16,
  },
})
