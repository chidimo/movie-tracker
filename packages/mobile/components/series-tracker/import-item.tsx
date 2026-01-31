import { StyleSheet, View } from 'react-native'
import type { Show } from '@movie-tracker/core'
import { Checkbox } from '@/components/form-elements/checkbox'

type Props = {
  show: Partial<Show>
  itemChecked: boolean
  onItemCheckChanged: (checked: boolean) => void
}

export const ImportItem = ({
  show,
  itemChecked,
  onItemCheckChanged,
}: Props) => {
  return (
    <View style={styles.itemRow}>
      <Checkbox
        label={show.title || show.imdbId || 'Untitled'}
        checked={itemChecked}
        onValueChange={(checked) => {
          onItemCheckChanged(checked)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  itemRow: { gap: 8 },
})
