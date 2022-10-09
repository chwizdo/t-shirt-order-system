import IconButton from "../../components/IconButton";
import SelectBox from "../../components/SelectBox";
import TextButton from "../../components/TextButton";
import { TrashIcon } from "@heroicons/react/24/solid";
import FormSize from "./FormSize";

export default ({
  selections,
  getOrderDetail,
  createVariation,
  getVariationDetail,
  updateVariationDetail,
  removeVariation,
  createSize,
  getSizeDetail,
  createPrint,
  getPrintDetail,
  updatePrintDetail,
  removePrintDetail,
}) => {
  return (
    <div>
      {Object.keys(getOrderDetail("variations")).map((vId, vIdx) => (
        <div key={vId}>
          <div className="text-xl leading-tight mb-12">
            VARIATION {vIdx + 1}
          </div>
          <div className="flex space-x-4 mb-6">
            <IconButton
              Icon={TrashIcon}
              theme="error"
              onClick={() => removeVariation(vId)}
            />
            <div className="flex-1">
              <SelectBox
                placeholder="Select Sleeve"
                list={selections.sleeves}
                value={Object.keys(getVariationDetail(vId, "sleeve"))[0]}
                onChanged={(key) =>
                  updateVariationDetail(vId, "sleeve", {
                    [key]: selections.sleeves[key],
                  })
                }
              />
            </div>
            <div className="flex-1">
              <SelectBox
                placeholder="Select Collar"
                list={selections.collars}
                value={Object.keys(getVariationDetail(vId, "collar"))[0]}
                onChanged={(key) =>
                  updateVariationDetail(vId, "collar", {
                    [key]: selections.collars[key],
                  })
                }
              />
            </div>
            <label className="relative block w-[104px] h-13 rounded-lg overflow-hidden">
              <input
                type="color"
                className="w-full h-full absolute inset-0"
                value={getVariationDetail(vId, "color")}
                onChange={(e) =>
                  updateVariationDetail(vId, "color", e.target.value)
                }
              />
              <div
                className={"absolute inset-0"}
                style={{ backgroundColor: getVariationDetail(vId, "color") }}
              ></div>
            </label>
          </div>
          <FormSize
            vId={vId}
            selections={selections}
            getVariationDetail={getVariationDetail}
            createSize={createSize}
            getSizeDetail={getSizeDetail}
            createPrint={createPrint}
            getPrintDetail={getPrintDetail}
            updatePrintDetail={updatePrintDetail}
            removePrintDetail={removePrintDetail}
          />
        </div>
      ))}
      <div className="flex-1 mb-12">
        <TextButton
          theme="light"
          text="Add New Variation"
          onClicked={() => createVariation()}
        />
      </div>
    </div>
  );
};
