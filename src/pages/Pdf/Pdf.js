import {
  Document,
  Page,
  Text,
  PDFViewer,
  View,
  Image,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withFirebase } from "../../services/Firebase";
import { withModelUtil } from "../../services/ModelUtil";
import PdfPrint from "./PdfPrint";
import PdfSize from "./PdfSize";
import PdfVariation from "./PdfVariation";
import moment from "moment";

const Pdf = ({ firebase, modelUtil }) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [image0, setImage0] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    getOrder();
  }, []);

  const getOrder = async () => {
    setIsLoading(true);
    const order = await firebase.getOrder(orderId);
    setOrder(order);
    setImage0(modelUtil.getTreeInfo(order, "image0"));
    setImage1(modelUtil.getTreeInfo(order, "image1"));
    setImage2(modelUtil.getTreeInfo(order, "image2"));
    setImage3(modelUtil.getTreeInfo(order, "image3"));
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <PDFViewer style={{ width: "100vw", height: "100vh", flex: 1 }}>
      <Document>
        <Page
          size="A4"
          style={{ fontSize: "11px", padding: "16px", lineHeight: "1" }}
        >
          <View
            fixed
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "16px",
              lineHeight: "1",
            }}
          >
            <Text style={{ width: "160px" }}>
              {moment(modelUtil.getTreeInfo(order, "date")).format(
                "YYYY-MM-DD"
              )}
            </Text>
            <Text>ORDER {modelUtil.getTreeInfo(order, "id")}</Text>
            <Text
              style={{ width: "160px", textAlign: "right" }}
              render={({ pageNumber, totalPages }) =>
                `PAGE ${pageNumber}/${totalPages}`
              }
            />
          </View>
          <View
            style={{
              border: "1px",
              height: "29.115",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1px",
              backgroundColor: "#e6e6e6",
            }}
          >
            <Text style={{ padding: "0px 8px" }}>Customer</Text>
            <Text style={{ padding: "0px 8px" }}>
              {modelUtil.getTreeInfo(
                modelUtil.getTreeInfo(order, "customer"),
                "name"
              ) || "-"}
            </Text>
          </View>
          <View
            style={{
              border: "1px",
              height: "29.115",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1px",
              backgroundColor: "#e6e6e6",
            }}
          >
            <Text style={{ padding: "0px 8px" }}>Designer</Text>
            <Text style={{ padding: "0px 8px" }}>
              {modelUtil.getTreeInfo(
                modelUtil.getTreeInfo(order, "designer"),
                "name"
              ) || "-"}
            </Text>
          </View>
          <View
            style={{
              border: "1px",
              height: "29.115",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1px",
              backgroundColor: "#e6e6e6",
            }}
          >
            <Text style={{ padding: "0px 8px" }}>Design</Text>
            <Text style={{ padding: "0px 8px" }}>
              {modelUtil.getTreeInfo(order, "design")}
            </Text>
          </View>
          <View
            style={{
              border: "1px",
              height: "29.115",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1px",
              backgroundColor: "#e6e6e6",
            }}
          >
            <Text style={{ padding: "0px 8px" }}>Material</Text>
            <Text style={{ padding: "0px 8px" }}>
              {modelUtil.getTreeInfo(
                modelUtil.getTreeInfo(order, "material"),
                "name"
              ) || "-"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "563px",
              height: "281px",
              marginBottom: "1px",
            }}
          >
            {image0 && (
              <Image
                style={{
                  border: "1px",
                  flex: "1",
                  marginRight: "1px",
                  height: "100%",
                  objectFit: "contain",
                  marginBottom: "1px",
                  overflow: "hidden",
                  padding: "1px",
                }}
                src={image0}
              ></Image>
            )}

            {image0 || (
              <View
                style={{
                  flex: "1",
                  marginRight: "1px",
                  height: "100%",
                  border: "1px",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1px",
                }}
              >
                <Text>No Image Selected</Text>
              </View>
            )}

            {image1 && (
              <Image
                style={{
                  border: "1px",
                  flex: "1",
                  height: "100%",
                  objectFit: "contain",
                  marginBottom: "1px",
                  overflow: "hidden",
                  padding: "1px",
                }}
                src={image1}
              ></Image>
            )}

            {image1 || (
              <View
                style={{
                  flex: "1",
                  height: "100%",
                  border: "1px",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1px",
                }}
              >
                <Text>No Image Selected</Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "563px",
              height: "281px",
              marginBottom: "1px",
            }}
          >
            {image2 && (
              <Image
                style={{
                  border: "1px",
                  flex: "1",
                  marginRight: "1px",
                  height: "100%",
                  objectFit: "contain",
                  marginBottom: "1px",
                  overflow: "hidden",
                  padding: "1px",
                }}
                src={image2}
              ></Image>
            )}

            {image2 || (
              <View
                style={{
                  flex: "1",
                  marginRight: "1px",
                  height: "100%",
                  border: "1px",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1px",
                }}
              >
                <Text>No Image Selected</Text>
              </View>
            )}

            {image3 && (
              <Image
                style={{
                  border: "1px",
                  flex: "1",
                  height: "100%",
                  objectFit: "contain",
                  marginBottom: "1px",
                  overflow: "hidden",
                  padding: "5px",
                }}
                src={image3}
              ></Image>
            )}

            {image3 || (
              <View
                style={{
                  flex: "1",
                  height: "100%",
                  border: "1px",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1px",
                }}
              >
                <Text>No Image Selected</Text>
              </View>
            )}
          </View>
          <View
            style={{
              border: "1px",
              height: "98px",
              padding: "8px",
              marginBottom: "1px",
            }}
          >
            <Text>{modelUtil.getTreeInfo(order, "remark") || "No remark"}</Text>
          </View>
          {Object.entries(modelUtil.getTreeInfo(order, "variations")).map(
            ([vId, vInfos]) => {
              const variation = { [vId]: vInfos };
              const sleeve = modelUtil.getTreeInfo(
                modelUtil.getTreeInfo(variation, "sleeve"),
                "name"
              );
              const collar = modelUtil.getTreeInfo(
                modelUtil.getTreeInfo(variation, "collar"),
                "name"
              );
              const color = modelUtil.getTreeInfo(variation, "color");
              return (
                <>
                  <PdfVariation sleeve={sleeve} collar={collar} color={color} />
                  {Object.entries(
                    modelUtil.getTreeInfo(variation, "sizes")
                  ).map(([sId, sInfos]) => {
                    const size = { [sId]: sInfos };
                    const name = modelUtil.getTreeInfo(
                      modelUtil.getTreeInfo(size, "size"),
                      "name"
                    );
                    return (
                      <>
                        <PdfSize size={name} />
                        {Object.entries(
                          modelUtil.getTreeInfo(size, "prints")
                        ).map(([pId, pInfos]) => {
                          const print = { [pId]: pInfos };
                          const name = modelUtil.getTreeInfo(print, "name");
                          const number = modelUtil.getTreeInfo(print, "number");
                          console.log(name);
                          console.log(number);
                          const quantity = modelUtil.getTreeInfo(
                            print,
                            "quantity"
                          );
                          return (
                            <PdfPrint
                              name={name}
                              number={number}
                              quantity={quantity}
                            />
                          );
                        })}
                      </>
                    );
                  })}
                </>
              );
            }
          )}
          {/* <PdfSize />
          <PdfPrint /> */}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default withFirebase(withModelUtil(Pdf));
