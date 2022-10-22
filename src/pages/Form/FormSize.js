import FormPrint from "./FormPrint";
import TextButton from "../../components/TextButton";
import { useState } from "react";
import Modal from "react-modal";
import { withModelUtil } from "../../services/ModelUtil";

const customStyles = {
  content: {
    width: "320px",
    height: "320px",
    margin: "auto",
    borderRadius: "0.5rem",
    border: "2px solid #101010",
  },
};

const FormSize = ({
  order,
  setOrder,
  modelUtil,
  variation,
  vId,
  selections,
  getSizeDetail,
  createPrint,
  getPrintDetail,
  updatePrintDetail,
  removePrintDetail,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const afterOpenModal = () => {};

  return (
    <div>
      {Object.entries(modelUtil.getTreeInfo(variation, "sizes")).map(
        ([id, infos], idx) => {
          const size = { [id]: infos };

          return (
            <div key={idx}>
              <div className="text-base leading-tight mb-6">
                {`${modelUtil.getTreeInfo(
                  modelUtil.getTreeInfo(size, "size"),
                  "name"
                )} SIZE`}
              </div>
              <FormPrint
                vId={vId}
                sId={id}
                getSizeDetail={getSizeDetail}
                createPrint={createPrint}
                getPrintDetail={getPrintDetail}
                updatePrintDetail={updatePrintDetail}
                removePrintDetail={removePrintDetail}
              />
            </div>
          );
        }
      )}
      <div className="flex-1 mb-12">
        <TextButton
          theme="light"
          text="Add Size"
          onClicked={() => openModal()}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div className="mb-4">
          <span
            className="leading-tight underline text-black cursor-pointer"
            onClick={closeModal}
          >
            Close
          </span>
        </div>
        <div className="space-y-4">
          {Object.keys(selections.sizes).map((sId) => (
            <TextButton
              key={sId}
              theme="light"
              text={selections.sizes[sId].name}
              onClicked={() => {
                const sizeId = Object.keys(selections.sizes)[0];

                const s = modelUtil.getEmptySize({
                  [sizeId]: selections.sizes[sizeId],
                });
                const v = modelUtil.updateSubTree(variation, "sizes", s);
                const o = modelUtil.updateSubTree(order, "variations", v);
                setOrder(o);

                setIsOpen(false);
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default withModelUtil(FormSize);
