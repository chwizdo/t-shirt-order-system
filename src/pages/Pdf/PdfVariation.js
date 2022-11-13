import { Text, View } from "@react-pdf/renderer";

const PdfVariation = ({ sleeve, collar, color }) => (
  <View
    style={{
      height: "29.115",
      flexDirection: "row",
      marginBottom: "1px",
      border: "1px",
      lineHeight: "1",
      alignItems: "center",
      backgroundColor: "#e6e6e6",
    }}
  >
    <Text style={{ flex: "1", padding: "0px 8px" }}>{sleeve || "-"}</Text>
    <View style={{ borderLeft: "1px", height: "100%" }} />
    <Text style={{ flex: "1", padding: "0px 8px" }}>{collar || "-"}</Text>
    <View style={{ borderLeft: "1px", height: "100%" }} />
    <Text style={{ flex: "1", padding: "0px 8px" }}>{color}</Text>
    <View style={{ borderLeft: "1px", height: "100%" }} />
    <View
      style={{
        width: "64px",
        backgroundColor: color,
        height: "100%",
      }}
    />
  </View>
);

export default PdfVariation;
