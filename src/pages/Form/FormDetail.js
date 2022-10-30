import ComboBox from "../../components/ComboBox";
import TextField from "../../components/TextField";
import DatePicker from "../../components/DatePicker";
import SelectBox from "../../components/SelectBox";
import { withModelUtil } from "../../services/ModelUtil";
import { useState } from "react";
import { withFirebase } from "../../services/Firebase";

const FormDetail = ({ order, setOrder, modelUtil, selections, firebase }) => {
  const [isUploading, setIsUploading] = useState(false);

  const image = modelUtil.getTreeInfo(order, "image");

  return (
    <div className="flex space-x-4 mb-12">
      <div className="flex-1 space-y-4">
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
      </div>
      <div className="w-64 space-y-4 flex flex-col">
        <div className="h-64 rounded-lg overflow-hidden border-2 border-grey">
          <input
            type="file"
            className="hidden"
            id="image"
            accept="image/png,image/jpeg"
            onChange={async (e) => {
              if (!e.target.files || e.target.files.length === 0) return;
              setIsUploading(true);
              const id = modelUtil.getTreeId(order);
              await firebase.uploadImage(e.target.files[0], id);
              const image = await firebase.getImageUrl(id);
              const o = modelUtil.updateTreeInfo(order, "image", image);
              setOrder(o);
              setIsUploading(false);
            }}
          />
          {isUploading ? (
            <div className="h-full w-full flex justify-center items-center">
              Uploading Image
            </div>
          ) : (
            <label htmlFor="image">
              {image ? (
                <img
                  className="h-full w-full object-cover"
                  src={modelUtil.getTreeInfo(order, "image")}
                />
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  Select Image
                </div>
              )}
            </label>
          )}
        </div>
        <textarea
          className="border-2 border-grey rounded-lg flex-1 py-4 px-6 outline-none focus:border-black transition"
          placeholder="Remarks"
          value={modelUtil.getTreeInfo(order, "remark")}
          onChange={(e) => {
            const o = modelUtil.updateTreeInfo(order, "remark", e.target.value);
            setOrder(o);
          }}
        />
      </div>
    </div>
  );
};

export default withFirebase(withModelUtil(FormDetail));
