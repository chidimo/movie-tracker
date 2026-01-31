import { CustomButton } from '../form-elements/custom-button'
import { DefaultModal } from '../modal'
import { ThemedView } from '../themed-view'
import { SearchSeries } from './search-series'
import { useOnOffSwitch } from '@/hooks/use-on-off-switch'

export const SearchTrigger = () => {
  const { isOn, setOn, setOff } = useOnOffSwitch()

  return (
    <ThemedView>
      <CustomButton title="Search" onPress={setOn} />

      <DefaultModal title="Search" visible={isOn} onRequestClose={setOff}>
        <SearchSeries />
      </DefaultModal>
    </ThemedView>
  )
}
