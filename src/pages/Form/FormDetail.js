import ComboBox from "../../components/ComboBox";
import TextField from "../../components/TextField";
import DatePicker from "../../components/DatePicker";
import SelectBox from "../../components/SelectBox";
import { withModelUtil } from "../../services/ModelUtil";
import { useState } from "react";
import { withFirebase } from "../../services/Firebase";
import ImagePicker from "../../components/ImagePicker";
import { Link } from "react-router-dom";
import TextButton from "../../components/TextButton";

const FormDetail = ({ order, setOrder, modelUtil, selections, firebase }) => {
  const [isUploading, setIsUploading] = useState(false);

  const image = modelUtil.getTreeInfo(order, "image");

  return (
    <div>
      <div className="space-y-4 mb-12">
        <ComboBox
          placeholder="Select Customer"
          list={selections.customers}
          value={modelUtil.getTreeId(modelUtil.getTreeInfo(order, "customer"))}
          onChanged={(id) => {
            const o = modelUtil.updateTreeInfo(order, "customer", {
              [id]: selections.customers[id],
            });
            setOrder(o);
          }}
        />
        <TextField
          placeholder="Design Name"
          value={modelUtil.getTreeInfo(order, "design")}
          onChanged={(value) => {
            const o = modelUtil.updateTreeInfo(order, "design", value);
            setOrder(o);
          }}
        />
        <ComboBox
          placeholder="Select Designer"
          list={selections.designers}
          value={modelUtil.getTreeId(modelUtil.getTreeInfo(order, "designer"))}
          onChanged={(id) => {
            const o = modelUtil.updateTreeInfo(order, "designer", {
              [id]: selections.designers[id],
            });
            setOrder(o);
          }}
        />
        <ComboBox
          placeholder="Select Material"
          list={selections.materials}
          value={modelUtil.getTreeId(modelUtil.getTreeInfo(order, "material"))}
          onChanged={(id) => {
            const o = modelUtil.updateTreeInfo(order, "material", {
              [id]: selections.materials[id],
            });
            setOrder(o);
          }}
        />
        <DatePicker
          value={modelUtil.getTreeInfo(order, "date")}
          onChanged={(value) => {
            const o = modelUtil.updateTreeInfo(order, "date", value);
            setOrder(o);
          }}
        />
        <SelectBox
          list={selections.status}
          value={modelUtil.getTreeId(modelUtil.getTreeInfo(order, "status"))}
          onChanged={(id) => {
            const o = modelUtil.updateTreeInfo(order, "status", {
              [id]: selections.status[id],
            });
            setOrder(o);
          }}
        />
        <div className="flex space-x-4">
          <div className="flex-1">
            <TextField
              placeholder="Google Drive Link"
              value={modelUtil.getTreeInfo(order, "link")}
              onChanged={(value) => {
                const o = modelUtil.updateTreeInfo(order, "link", value);
                setOrder(o);
              }}
            />
          </div>
          <a href={modelUtil.getTreeInfo(order, "link")} target="_blank">
            <TextButton text="Open Link" />
          </a>
        </div>
        <textarea
          className="border-2 border-grey rounded-lg w-full h-32 py-4 px-6 outline-none focus:border-black transition"
          placeholder="Remarks"
          value={modelUtil.getTreeInfo(order, "remark") || ""}
          onChange={(e) => {
            const o = modelUtil.updateTreeInfo(order, "remark", e.target.value);
            setOrder(o);
          }}
        />
      </div>
      <div className="grid mb-12 grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex-1">
          <ImagePicker order={order} setOrder={setOrder} index={0} />
        </div>
        <div className="flex-1">
          <ImagePicker order={order} setOrder={setOrder} index={1} />
        </div>
        <div className="flex-1">
          <ImagePicker order={order} setOrder={setOrder} index={2} />
        </div>
        <div className="flex-1">
          <ImagePicker order={order} setOrder={setOrder} index={3} />
        </div>
      </div>
    </div>
  );
};

export default withFirebase(withModelUtil(FormDetail));
