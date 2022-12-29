import {
  ChevronLeftIcon,
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { withFirebase } from "../../services/Firebase";
import { withModelUtil } from "../../services/ModelUtil";
import SettingSection from "./SettingSection";

const Setting = ({ firebase, modelUtil }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState({});
  const [designers, setDesigners] = useState({});
  const [materials, setMaterials] = useState({});
  const [sleeves, setSleeves] = useState({});
  const [collars, setCollars] = useState({});
  const [sizes, setSizes] = useState({});
  const [status, setStatus] = useState({});

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    setCustomers(await firebase.getChoices("customers"));
    setDesigners(await firebase.getChoices("designers"));
    setMaterials(await firebase.getChoices("materials"));
    setSleeves(await firebase.getChoices("sleeves"));
    setCollars(await firebase.getChoices("collars"));
    setSizes(await firebase.getChoices("sizes"));
    setStatus(await firebase.getChoices("status"));
    setIsLoading(false);
  };

  const getOnEditHandler = (choice, tree, setTree) => {
    return async (id, name) => {
      await firebase.setChoice(choice, id, name);
      const treeCopy = { ...tree };
      treeCopy[id] = { name: name };
      setTree(treeCopy);
    };
  };

  const getOnRemoveHandler = (choice, tree, setTree) => {
    return async (id) => {
      await firebase.deleteChoice(choice, id);
      const treeCopy = { ...tree };
      delete treeCopy[id];
      setTree(treeCopy);
    };
  };

  const getOnAddHandler = (choice, tree, setTree) => {
    return async (name) => {
      const id = firebase.generateDocId();
      await firebase.createChoice(choice, id, name);
      const treeCopy = { ...tree };
      treeCopy[id] = { name: name };
      setTree(treeCopy);
    };
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4">
        <Link to="/" className="flex space-x-2 mb-12">
          <ChevronLeftIcon className="w-5 h-5 text-black" />
          <span className="leading-tight underline">Back to Homepage</span>
        </Link>
        <SettingSection
          title="Customer"
          addButtonText="New customer"
          trees={customers}
          onEditHandler={getOnEditHandler("customers", customers, setCustomers)}
          onRemoveHandler={getOnRemoveHandler(
            "customers",
            customers,
            setCustomers
          )}
          onAddHandler={getOnAddHandler("customers", customers, setCustomers)}
        />
        {/* <SettingSection
          title="Collar"
          addButtonText="New collar"
          trees={collars}
          onEditHandler={getOnEditHandler("collars", collars, setCollars)}
          onRemoveHandler={getOnRemoveHandler("collars", collars, setCollars)}
          onAddHandler={getOnAddHandler("collars", collars, setCollars)}
        />
        <SettingSection
          title="Sleeve"
          addButtonText="New sleeve"
          trees={sleeves}
          onEditHandler={getOnEditHandler("sleeves", sleeves, setSleeves)}
          onRemoveHandler={getOnRemoveHandler("sleeves", sleeves, setSleeves)}
          onAddHandler={getOnAddHandler("sleeves", sleeves, setSleeves)}
        />
        <SettingSection
          title="Material"
          addButtonText="New material"
          trees={materials}
          onEditHandler={getOnEditHandler("materials", materials, setMaterials)}
          onRemoveHandler={getOnRemoveHandler(
            "materials",
            materials,
            setMaterials
          )}
          onAddHandler={getOnAddHandler("materials", materials, setMaterials)}
        />
        <SettingSection
          title="Designer"
          addButtonText="New designer"
          trees={designers}
          onEditHandler={getOnEditHandler("designers", designers, setDesigners)}
          onRemoveHandler={getOnRemoveHandler(
            "designers",
            designers,
            setDesigners
          )}
          onAddHandler={getOnAddHandler("designers", designers, setDesigners)}
        />
        <SettingSection
          title="Size"
          addButtonText="New size"
          trees={sizes}
          onEditHandler={getOnEditHandler("sizes", sizes, setSizes)}
          onRemoveHandler={getOnRemoveHandler("sizes", sizes, setSizes)}
          onAddHandler={getOnAddHandler("sizes", sizes, setSizes)}
        />
        <SettingSection
          title="Status"
          addButtonText="New status"
          trees={status}
          onEditHandler={getOnEditHandler("status", status, setStatus)}
          onRemoveHandler={getOnRemoveHandler("status", status, setStatus)}
          onAddHandler={getOnAddHandler("status", status, setStatus)}
        /> */}
      </div>
    </div>
  );
};

export default withModelUtil(withFirebase(Setting));
