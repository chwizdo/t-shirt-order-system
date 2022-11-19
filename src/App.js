import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Forget from "./pages/Forget";
import Form from "./pages/Form";
import { withFirebase } from "./services/Firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Setting from "./pages/Setting";
import {
  Document,
  Page,
  Text,
  PDFDownloadLink,
  PDFViewer,
  View,
  Image,
} from "@react-pdf/renderer";
import Pdf from "./pages/Pdf";
import Member from "./pages/Member";

const App = ({ firebase }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebase.auth, (user) => {
      setIsAuthenticated(user !== null);
    });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {isAuthenticated ? <Redirect to={{ pathname: "/" }} /> : <Login />}
        </Route>
        <Route path="/signup">
          {isAuthenticated ? <Redirect to={{ pathname: "/" }} /> : <SignUp />}
        </Route>
        <Route path="/forget">
          {isAuthenticated ? <Redirect to={{ pathname: "/" }} /> : <Forget />}
        </Route>
        <Route path="/setting">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Setting />
          )}
        </Route>
        <Route path="/member">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Member />
          )}
        </Route>
        <Route path="/new">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Form />
          )}
        </Route>
        <Route path="/:orderId/pdf">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Pdf />
          )}
        </Route>
        <Route path="/:orderId">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Form />
          )}
        </Route>
        <Route path="/">
          {!isAuthenticated ? (
            <Redirect to={{ pathname: "/login" }} />
          ) : (
            <Home />
          )}
        </Route>
      </Switch>
    </Router>
  );
};

// const Example = () => {
//   return (
//     <Document>
//       <Page
//         size="A4"
//         style={{ fontSize: "11px", padding: "16px", lineHeight: "1" }}
//       >
//         <View
//           fixed
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: "16px",
//             lineHeight: "1",
//           }}
//         >
//           <Text>ORDER 10003</Text>
//           <Text
//             render={({ pageNumber, totalPages }) =>
//               `PAGE ${pageNumber}/${totalPages}`
//             }
//           />
//         </View>
//         <View
//           style={{
//             border: "1px",
//             height: "29.115",
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: "1px",
//             backgroundColor: "#e6e6e6",
//           }}
//         >
//           <Text style={{ padding: "0px 8px" }}>Customer</Text>
//           <Text style={{ padding: "0px 8px" }}>Anderson</Text>
//         </View>
//         <View
//           style={{
//             border: "1px",
//             height: "29.115",
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: "1px",
//             backgroundColor: "#e6e6e6",
//           }}
//         >
//           <Text style={{ padding: "0px 8px" }}>Designer</Text>
//           <Text style={{ padding: "0px 8px" }}>Kaibin</Text>
//         </View>
//         <View
//           style={{
//             border: "1px",
//             height: "29.115",
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: "1px",
//             backgroundColor: "#e6e6e6",
//           }}
//         >
//           <Text style={{ padding: "0px 8px" }}>Design</Text>
//           <Text style={{ padding: "0px 8px" }}>Emerald Premium</Text>
//         </View>
//         <View
//           style={{
//             border: "1px",
//             height: "29.115",
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: "1px",
//             backgroundColor: "#e6e6e6",
//           }}
//         >
//           <Text style={{ padding: "0px 8px" }}>Material</Text>
//           <Text style={{ padding: "0px 8px" }}>Mini Eyelet</Text>
//         </View>
//         <Image
//           style={{
//             border: "1px",
//             width: "563px",
//             height: "563px",
//             objectFit: "contain",
//             marginBottom: "1px",
//           }}
//           src="https://images.unsplash.com/photo-1668248949793-12718a4dd485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=784&q=80"
//         ></Image>
//         <View
//           style={{
//             border: "1px",
//             height: "98px",
//             padding: "16px",
//             marginBottom: "1px",
//           }}
//         >
//           <Text>No Remarks</Text>
//         </View>
//         <View
//           style={{
//             height: "29.115",
//             flexDirection: "row",
//             marginBottom: "1px",
//             border: "1px",
//             lineHeight: "1",
//             alignItems: "center",
//             backgroundColor: "#e6e6e6",
//           }}
//         >
//           <Text style={{ flex: "1", padding: "0px 8px" }}>Long sleeve</Text>
//           <View style={{ borderLeft: "1px", height: "100%" }} />
//           <Text style={{ flex: "1", padding: "0px 8px" }}>Round collar</Text>
//           <View style={{ borderLeft: "1px", height: "100%" }} />
//           <Text style={{ flex: "1", padding: "0px 8px" }}>#44F3FF</Text>
//           <View style={{ borderLeft: "1px", height: "100%" }} />
//           <View
//             style={{ width: "64px", backgroundColor: "red", height: "100%" }}
//           />
//         </View>
//         <View
//           style={{
//             lineHeight: "1",
//             flexDirection: "row",
//             border: "1px",
//             marginBottom: "1px",
//             height: "29.115",
//             alignItems: "center",
//             backgroundColor: "#e6e6e6",
//           }}
//         >
//           <Text style={{ flex: "1", padding: "0px 8px" }}>SIZE: S</Text>
//           <View style={{ borderLeft: "1px", height: "100%" }} />
//           <Text style={{ width: "64px", padding: "0px 8px" }}>1</Text>
//         </View>
//         <View
//           style={{
//             lineHeight: "1",
//             flexDirection: "row",
//             border: "1px",
//             marginBottom: "1px",
//             height: "29.115",
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ flex: "1", padding: "0px 8px" }}>Johnathan</Text>
//           <View style={{ borderLeft: "1px", height: "100%" }} />
//           <Text style={{ width: "64px", padding: "0px 8px" }}>12</Text>
//           <View style={{ borderLeft: "1px", height: "100%" }} />
//           <Text style={{ width: "64px", padding: "0px 8px" }}>1</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// const Viewer = () => {
//   return (
//     <PDFViewer style={{ width: "100vw", height: "100vh", flex: 1 }}>
//       <Example />
//     </PDFViewer>
//   );
// };

export default withFirebase(App);
