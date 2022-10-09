import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import IconButton from "../../components/IconButton";
import TextField from "../../components/TextField";

export default ({
  vId,
  sId,
  getSizeDetail,
  createPrint,
  getPrintDetail,
  updatePrintDetail,
  removePrintDetail,
}) => {
  return (
    <div>
      {Object.keys(getSizeDetail(vId, sId, "prints")).map((pId) => {
        return (
          <div key={pId} className="flex space-x-4 mb-4">
            <IconButton
              Icon={MinusIcon}
              theme="error-light"
              onClick={() => removePrintDetail(vId, sId, pId)}
            />
            <div className="flex-1">
              <TextField
                placeholder="Name (Optional)"
                value={getPrintDetail(vId, sId, pId, "name")}
                onChanged={(value) =>
                  updatePrintDetail(vId, sId, pId, "name", value)
                }
              />
            </div>
            <div className="flex-1">
              <TextField
                placeholder="Number (Optional)"
                value={getPrintDetail(vId, sId, pId, "number")}
                onChanged={(value) =>
                  updatePrintDetail(vId, sId, pId, "number", value)
                }
              />
            </div>
            <div className="w-[104px]">
              <TextField
                placeholder="1"
                value={getPrintDetail(vId, sId, pId, "quantity")}
                onChanged={(value) =>
                  updatePrintDetail(vId, sId, pId, "quantity", value)
                }
              />
            </div>
          </div>
        );
      })}
      <div className=" mb-6">
        <IconButton
          Icon={PlusIcon}
          theme="light"
          onClick={() => createPrint(vId, sId)}
        />
      </div>
    </div>
  );
};
