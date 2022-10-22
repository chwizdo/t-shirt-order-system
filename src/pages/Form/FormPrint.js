import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import IconButton from "../../components/IconButton";
import TextField from "../../components/TextField";
import { withModelUtil } from "../../services/ModelUtil";

const FormPrint = ({ modelUtil, order, setOrder, variation, size }) => {
  return (
    <div>
      {Object.entries(modelUtil.getTreeInfo(size, "prints")).map(
        ([id, infos]) => {
          const print = { [id]: infos };

          return (
            <div key={id} className="flex space-x-4 mb-4">
              <IconButton
                Icon={MinusIcon}
                theme="error-light"
                onClick={() => {
                  const s = modelUtil.removeSubTree(size, "prints", id);
                  const v = modelUtil.updateSubTree(variation, "sizes", s);
                  const o = modelUtil.updateSubTree(order, "variations", v);
                  setOrder(o);
                }}
              />
              <div className="flex-1">
                <TextField
                  placeholder="Name (Optional)"
                  value={modelUtil.getTreeInfo(print, "name")}
                  onChanged={(value) => {
                    const p = modelUtil.updateTreeInfo(print, "name", value);
                    const s = modelUtil.updateSubTree(size, "prints", p);
                    const v = modelUtil.updateSubTree(variation, "sizes", s);
                    const o = modelUtil.updateSubTree(order, "variations", v);
                    setOrder(o);
                  }}
                />
              </div>
              <div className="flex-1">
                <TextField
                  placeholder="Number (Optional)"
                  value={modelUtil.getTreeInfo(print, "number")}
                  onChanged={(value) => {
                    const p = modelUtil.updateTreeInfo(print, "number", value);
                    const s = modelUtil.updateSubTree(size, "prints", p);
                    const v = modelUtil.updateSubTree(variation, "sizes", s);
                    const o = modelUtil.updateSubTree(order, "variations", v);
                    setOrder(o);
                  }}
                />
              </div>
              <div className="w-[104px]">
                <TextField
                  type="number"
                  placeholder="1"
                  value={modelUtil.getTreeInfo(print, "quantity")}
                  onChanged={(value) => {
                    const p = modelUtil.updateTreeInfo(
                      print,
                      "quantity",
                      value
                    );
                    const s = modelUtil.updateSubTree(size, "prints", p);
                    const v = modelUtil.updateSubTree(variation, "sizes", s);
                    const o = modelUtil.updateSubTree(order, "variations", v);
                    setOrder(o);
                  }}
                />
              </div>
            </div>
          );
        }
      )}
      <div className=" mb-6">
        <IconButton
          Icon={PlusIcon}
          theme="light"
          onClick={() => {
            const p = modelUtil.getEmptyPrint();
            const s = modelUtil.updateSubTree(size, "prints", p);
            const v = modelUtil.updateSubTree(variation, "sizes", s);
            const o = modelUtil.updateSubTree(order, "variations", v);
            setOrder(o);
          }}
        />
      </div>
    </div>
  );
};

export default withModelUtil(FormPrint);
