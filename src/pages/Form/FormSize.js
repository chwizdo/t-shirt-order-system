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
  modelUtil,
  variation,
  vId,
  selections,
  // getVariationDetail,
  createSize,
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
      {/* {Object.keys(getVariationDetail(vId, "sizes")).map((sId, sIdx) => { */}
      {Object.keys(modelUtil.getTreeInfo(variation, "sizes")).map(
        (sId, sIdx) => {
          return (
            <div key={sIdx}>
              <div className="text-base leading-tight mb-6">
                {`${
                  Object.values(getSizeDetail(vId, sId, "size"))[0].name
                } SIZE | ${
                  Object.keys(getSizeDetail(vId, sId, "size")).length
                } TOTAL`}
              </div>
              <FormPrint
                vId={vId}
                sId={sId}
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
                createSize(vId, sId);
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
