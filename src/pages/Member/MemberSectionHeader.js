import { PlusIcon } from "@heroicons/react/24/solid";

const MemberSectionHeader = ({
  title = "Title",
  showAddButton = true,
  addButtonText = "Text",
  onAddButtonClicked = () => {},
}) => {
  return (
    <div className="flex justify-between mb-6">
      <div className="text-xl leading-tight">{title}</div>
      {showAddButton && (
        <button
          className="flex underline space-x-2"
          onClick={onAddButtonClicked}
        >
          <div>{addButtonText}</div>
          <PlusIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default MemberSectionHeader;
