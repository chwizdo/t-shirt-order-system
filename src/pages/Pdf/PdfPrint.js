import { Text, View } from "@react-pdf/renderer";

const PdfPrint = ({ name, number, quantity }) => (
  <View
    style={{
      lineHeight: "1",
      flexDirection: "row",
      border: "1px",
      marginBottom: "1px",
      height: "29.115",
      alignItems: "center",
    }}
  >
    <Text style={{ flex: "1", padding: "0px 8px" }}>{name || "-"}</Text>
    <View style={{ borderLeft: "1px", height: "100%" }} />
    <Text style={{ width: "64px", padding: "0px 8px" }}>{number || "-"}</Text>
    <View style={{ borderLeft: "1px", height: "100%" }} />
    <Text style={{ width: "64px", padding: "0px 8px" }}>{quantity}</Text>
  </View>
);

export default PdfPrint;
