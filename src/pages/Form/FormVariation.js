import IconButton from "../../components/IconButton";
import SelectBox from "../../components/SelectBox";
import TextButton from "../../components/TextButton";
import { TrashIcon } from "@heroicons/react/24/solid";
import FormSize from "./FormSize";
import { withModelUtil } from "../../services/ModelUtil";

const FormVariation = ({
  order,
  setOrder,
  selections,
  modelUtil,
  createSize,
  getSizeDetail,
  createPrint,
  getPrintDetail,
  updatePrintDetail,
  removePrintDetail,
}) => {
  const variationEntries = Object.entries(
    modelUtil.getTreeInfo(order, "variations")
  );

  return (
    <div>
      {variationEntries.map(([id, infos], idx) => {
        const variation = { [id]: infos };

        return (
          <div key={id}>
            <div className="text-xl leading-tight mb-12">
              VARIATION {idx + 1}
            </div>
            <div className="flex space-x-4 mb-6">
              <IconButton
                Icon={TrashIcon}
                theme="error"
                onClick={() => {
                  const o = modelUtil.removeSubTree(order, "variations", id);
                  setOrder(o);
                }}
              />
              <div className="flex-1">
                <SelectBox
                  placeholder="Select Sleeve"
                  list={selections.sleeves}
                  value={modelUtil.getTreeId(
                    modelUtil.getTreeInfo(variation, "sleeve")
                  )}
                  onChanged={(id) => {
                    const v = modelUtil.updateTreeInfo(variation, "sleeve", {
                      [id]: selections.sleeves[id],
                    });
                    const o = modelUtil.updateSubTree(order, "variations", v);
                    setOrder(o);
                  }}
                />
              </div>
              <div className="flex-1">
                <SelectBox
                  placeholder="Select Collar"
                  list={selections.collars}
                  value={modelUtil.getTreeId(
                    modelUtil.getTreeInfo(variation, "collar")
                  )}
                  onChanged={(id) => {
                    const v = modelUtil.updateTreeInfo(variation, "collar", {
                      [id]: selections.collars[id],
                    });
                    const o = modelUtil.updateSubTree(order, "variations", v);
                    setOrder(o);
                  }}
                />
              </div>
              <label className="relative block w-[104px] h-13 rounded-lg overflow-hidden">
                <input
                  type="color"
                  className="w-full h-full absolute inset-0"
                  value={modelUtil.getTreeInfo(variation, "color")}
                  onChange={(e) => {
                    const v = modelUtil.updateTreeInfo(
                      variation,
                      "color",
                      e.target.value
                    );
                    const o = modelUtil.updateSubTree(order, "variations", v);
                    setOrder(o);
                  }}
                />
                <div
                  className={"absolute inset-0"}
                  style={{
                    backgroundColor: modelUtil.getTreeInfo(variation, "color"),
                  }}
                ></div>
              </label>
            </div>
            <FormSize
              vId={id}
              selections={selections}
              variation={variation}
              createSize={createSize}
              getSizeDetail={getSizeDetail}
              createPrint={createPrint}
              getPrintDetail={getPrintDetail}
              updatePrintDetail={updatePrintDetail}
              removePrintDetail={removePrintDetail}
            />
          </div>
        );
      })}
      <div className="flex-1 mb-12">
        <TextButton
          theme="light"
          text="Add New Variation"
          onClicked={() => {
            const collarId = Object.keys(selections.collars)[0];
            const sleeveId = Object.keys(selections.sleeves)[0];
            const sizeId = Object.keys(selections.sizes)[0];

            const v = modelUtil.getEmptyVariation(
              { [collarId]: selections.collars[collarId] },
              { [sleeveId]: selections.sleeves[sleeveId] },
              { [sizeId]: selections.sizes[sizeId] }
            );
            const o = modelUtil.updateSubTree(order, "variations", v);
            setOrder(o);
          }}
        />
      </div>
    </div>
  );
};

export default withModelUtil(FormVariation);
