import { Filters } from "@/types/filters";
import { ScrollView, StyleSheet } from "react-native";
import { Touchable } from "./Touchable";
import { useColors } from "@/hooks/useColors";

type FilterBarProps = {
  filters: Filters[];
  onChange: (key: Filters["range"]) => void;
};

export const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const { primary } = useColors();
  return (
    <ScrollView
      style={{
        flex: 1,
        marginBottom: 12,
      }}
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      {filters.map((f, i) => (
        <Touchable
          key={i}
          title={f.title}
          type="shadow"
          onPress={() => onChange(f.range)}
          style={[
            f.active && { backgroundColor: primary },
            styles.buttonFilter,
          ]}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonFilter: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
