import ComboBox from "../../components/ComboBox";
import TextField from "../../components/TextField";
import DatePicker from "../../components/DatePicker";
import SelectBox from "../../components/SelectBox";

export default ({ selections, getOrderDetail, updateOrderDetail }) => {
  return (
    <div className="flex space-x-4 mb-12">
      <div className="flex-1 space-y-4">
        <ComboBox
          placeholder="Select Customer"
          list={selections.customers}
          value={Object.keys(getOrderDetail("customer"))[0]}
          onChanged={(key) =>
            updateOrderDetail("customer", { [key]: selections.customers[key] })
          }
        />
        <TextField
          placeholder="Design Name"
          value={getOrderDetail("design")}
          onChanged={(value) => updateOrderDetail("design", value)}
        />
        <ComboBox
          placeholder="Select Designer"
          list={selections.designers}
          value={Object.keys(getOrderDetail("designer"))[0]}
          onChanged={(key) =>
            updateOrderDetail("designer", { [key]: selections.designers[key] })
          }
        />
        <ComboBox
          placeholder="Select Material"
          list={selections.materials}
          value={Object.keys(getOrderDetail("material"))[0]}
          onChanged={(key) =>
            updateOrderDetail("material", { [key]: selections.materials[key] })
          }
        />
        <DatePicker
          value={getOrderDetail("date")}
          onChanged={(value) => updateOrderDetail("date", value)}
        />
        <SelectBox
          list={selections.status}
          value={Object.keys(getOrderDetail("status"))[0]}
          onChanged={(key) =>
            updateOrderDetail("status", { [key]: selections.status[key] })
          }
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
          value={getOrderDetail("remark")}
          onChange={(e) => updateOrderDetail("remark", e.target.value)}
        />
      </div>
    </div>
  );
};
