import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import MemberSection from "./MemberSection";
import { useEffect, useState } from "react";
import { withFirebase } from "../../services/Firebase";
import Modal from "react-modal";
import MemberProfile from "./MemberProfile";
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

const Member = ({ firebase, modelUtil }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState(firebase.auth.currentUser.displayName);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    setMembers(await firebase.getMembers());
    setIsAuth(await firebase.getIsAuth());
    setIsLoading(false);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const afterOpenModal = () => {
    const id = firebase.generateDocId();
    setId(id);
    firebase.setInvitation(id);
  };

  const removeUser = async (id) => {
    await firebase.setMemberActiveStatus(id, false);
    const membersCopy = { ...members };
    const member = modelUtil.updateTreeInfo(
      { [id]: membersCopy[id] },
      "isActive",
      false
    );
    membersCopy[id] = member[id];
    setMembers(membersCopy);
  };

  const addUser = async (id) => {
    await firebase.setMemberActiveStatus(id, true);
    const membersCopy = { ...members };
    const member = modelUtil.updateTreeInfo(
      { [id]: membersCopy[id] },
      "isActive",
      true
    );
    membersCopy[id] = member[id];
    setMembers(membersCopy);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4">
        <Link to="/" className="flex space-x-2 mb-12">
          <ChevronLeftIcon className="w-5 h-5 text-black" />
          <span className="leading-tight underline">Back to Homepage</span>
        </Link>
        <MemberProfile
          title="My Profile"
          name={name}
          onEditHandler={async (name) => {
            await firebase.updateName(firebase.auth.currentUser, name);
            setName(name);
          }}
        />
        {isAuth && (
          <MemberSection
            title="Active Member"
            addButtonText="New invitation code"
            trees={Object.fromEntries(
              Object.entries(members).filter(([id, infos]) => {
                const member = { [id]: infos };
                return modelUtil.getTreeInfo(member, "isActive");
              })
            )}
            onItemClickHandler={removeUser}
            onAddHandler={openModal}
          />
        )}
        {isAuth && (
          <MemberSection
            title="Removed Member"
            forIsActive={false}
            showAddButton={false}
            trees={Object.fromEntries(
              Object.entries(members).filter(([id, infos]) => {
                const member = { [id]: infos };
                return !modelUtil.getTreeInfo(member, "isActive");
              })
            )}
            onItemClickHandler={addUser}
          />
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div className="absolute left-0 top-0">
          <span
            className="leading-tight underline text-black cursor-pointer"
            onClick={closeModal}
          >
            Close
          </span>
        </div>
        <div className="h-full w-full flex flex-col justify-center items-center">
          <div>Invitation code can only be use once</div>
          <div>{id}</div>
        </div>
      </Modal>
    </div>
  );
};

export default withModelUtil(withFirebase(Member));
