import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import TableRow from "../../components/TableRow";
import TextButton from "../../components/TextButton";
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../../services/Firebase";
import { withModelUtil } from "../../services/ModelUtil";

const Home = ({ firebase, modelUtil }) => {
  const onLogoutClicked = () => firebase.logout();
  const onNewOrderClicked = () => history.push("/new");
  const onSettingClicked = () => history.push("/setting");
  const onMemberClicked = () => history.push("/member");

  const [query, setQuery] = useState("");
  const [summaries, setSummaries] = useState({});
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    const summaries = await firebase.getSummaries();
    setSummaries(summaries);

    const status = await firebase.getChoices("status");
    setStatus(status);

    setIsLoading(false);
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
        {/* New Button, Search and Menu */}

        <div className="flex space-x-4 mb-4">
          <TextButton text="New Order" onClicked={onNewOrderClicked} />
          <div className="flex-1">
            {/* <TextField
              placeholder="Search"
              value={query}
              onChanged={setQuery}
            /> */}
          </div>
          <IconButton Icon={Cog6ToothIcon} onClick={onSettingClicked} />
          <IconButton Icon={UsersIcon} onClick={onMemberClicked} />
          <IconButton
            theme="error"
            Icon={ArrowRightOnRectangleIcon}
            onClick={onLogoutClicked}
          />
        </div>

        {/* Filters */}

        <div className="grid grid-cols-3 gap-4 mb-12">
          {/* <ComboBox />
          <ComboBox />
          <ComboBox />
          <ComboBox />
          <ComboBox /> */}
        </div>

        {/* Table */}

        <div className="mb-12">
          {/* Table Header */}

          <div className="flex mb-4">
            <div className="flex flex-1 space-x-8 border-l-2 border-white pr-6 pl-[92px] ">
              <div className="w-12">No.</div>
              <div className="w-[5.25rem] hidden md:block">Due Date</div>
              <div className="flex-1">Design</div>
              <div className="flex-1">Client</div>
            </div>
            <div className="w-[178px] pl-6 border-l-2 border-white hidden sm:block">
              Status
            </div>
          </div>

          {/* Table Rows */}

          <div className="space-y-4">
            {Object.keys(summaries).map((id) => {
              const summary = { [id]: summaries[id] };

              return (
                <TableRow
                  key={id}
                  id={modelUtil.getTreeInfo(summary, "id")}
                  order={summary}
                  status={status}
                  onEntryClicked={() => history.push(`/${id}`)}
                  onStatusChanged={async (statusId) => {
                    const summariesCopy = { ...summaries };
                    const summaryCopy = { ...summary };
                    await firebase.updateOrderStatus(
                      modelUtil.getTreeId(summaryCopy),
                      statusId
                    );
                    summariesCopy[id] = modelUtil.getTreeInfos(
                      modelUtil.updateTreeInfo(summaryCopy, "status", {
                        [statusId]: status[statusId],
                      })
                    );
                    setSummaries(summariesCopy);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Pagination */}

        {/* <div className="flex space-x-4 justify-end">
          <IconButton Icon={ChevronDoubleLeftIcon} theme="light" />
          <NumberButton number="1" selected={true} />
          <NumberButton number="2" />
          <NumberButton number="3" />
          <IconButton Icon={ChevronDoubleRightIcon} theme="light" />
        </div> */}
      </div>
    </div>
  );
};

export default withModelUtil(withFirebase(Home));
