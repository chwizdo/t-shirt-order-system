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
import IconButton from "../../components/IconButton";
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

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    setCustomers(await firebase.getChoices("customers"));
    setDesigners(await firebase.getChoices("designers"));
    setMaterials(await firebase.getChoices("materials"));
    setSleeves(await firebase.getChoices("sleeves"));
    setCollars(await firebase.getChoices("collars"));
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
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4">
        <Link to="/" className="flex space-x-2 mb-12">
          <ChevronLeftIcon className="w-5 h-5 text-black" />
          <span className="leading-tight underline">Back to Homepage</span>
        </Link>
        <SettingSection
          title="Customer"
          addText="New customer"
          tree={customers}
        />
        <SettingSection title="Sleeve" addText="New sleeve" tree={sleeves} />
        <SettingSection title="Collar" addText="New collar" tree={collars} />
        <SettingSection
          title="Material"
          addText="New material"
          tree={materials}
        />
        <SettingSection
          title="Designer"
          addText="New designer"
          tree={designers}
        />
      </div>
    </div>
  );
};

export default withModelUtil(withFirebase(Setting));
