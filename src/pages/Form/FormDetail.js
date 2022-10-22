import ComboBox from "../../components/ComboBox";
import TextField from "../../components/TextField";
import DatePicker from "../../components/DatePicker";
import SelectBox from "../../components/SelectBox";
import { withModelUtil } from "../../services/ModelUtil";

const FormDetail = ({ order, setOrder, modelUtil, selections }) => {
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
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          />
        </div>
        <textarea
          className="border-2 border-grey rounded-lg flex-1 py-4 px-6 outline-none focus:border-black transition"
          placeholder="Remarks"
          value={modelUtil.getTreeId(modelUtil.getTreeInfo(order, "remark"))}
          onChange={(e) => {
            const o = modelUtil.updateTreeInfo(order, "remark", e.target.value);
            setOrder(o);
          }}
        />
      </div>
    </div>
  );
};

export default withModelUtil(FormDetail);
