import { Text, View } from "@react-pdf/renderer";

const PdfSize = ({ size }) => (
  <View
    style={{
      lineHeight: "1",
      flexDirection: "row",
      border: "1px",
      marginBottom: "1px",
      height: "29.115",
      alignItems: "center",
      backgroundColor: "#e6e6e6",
    }}
  >
    <Text style={{ flex: "1", padding: "0px 8px" }}>SIZE: {size || "-"}</Text>
    {/* <View style={{ borderLeft: "1px", height: "100%" }} />
    <Text style={{ width: "64px", padding: "0px 8px" }}>1</Text> */}
  </View>
);

export default PdfSize;
