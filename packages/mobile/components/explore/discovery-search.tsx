import { StyleSheet, View } from 'react-native'
import { CustomButton } from '@/components/form-elements/custom-button'
import { CustomInput } from '@/components/form-elements/custom-input'

interface DiscoverySearchProps {
  discoveryQuery: string
  setDiscoveryQuery: (query: string) => void
  onSearch: () => void
}

export const DiscoverySearch = ({
  discoveryQuery,
  setDiscoveryQuery,
  onSearch,
}: DiscoverySearchProps) => {
  return (
    <View style={styles.searchContainer}>
      <CustomInput
        value={discoveryQuery}
        onChangeText={setDiscoveryQuery}
        placeholder="Search for any series to get AI insights"
        returnKeyType="search"
        onSubmitEditing={onSearch}
        containerStyle={styles.searchInput}
      />
      <CustomButton
        title="Analyze"
        variant="PRIMARY"
        onPress={onSearch}
        containerStyle={styles.searchButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    width: 'auto',
    paddingHorizontal: 8,
  },
})
