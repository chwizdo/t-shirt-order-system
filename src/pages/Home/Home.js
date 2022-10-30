import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import TableRow from "../../components/TableRow";
import TextButton from "../../components/TextButton";
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../../services/Firebase";

const Home = ({ firebase }) => {
  const onLogoutClicked = () => firebase.logout();
  const onNewOrderClicked = () => history.push("/new");
  const onSettingClicked = () => history.push("/setting");

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
            <div className="flex flex-1 space-x-8 border-l-2 border-white px-6">
              <div className="w-20">Order No</div>
              <div className="w-24">Created At</div>
              <div className="flex-1">Customer Name</div>
            </div>
            <div className="w-[230px] pl-6 border-l-2 border-white">Status</div>
          </div>

          {/* Table Rows */}

          <div className="space-y-4">
            {Object.keys(summaries).map((id) => {
              return (
                <TableRow
                  key={id}
                  id={id}
                  order={summaries[id]}
                  status={status}
                  onEntryClicked={() => history.push(`/${id}`)}
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

export default withFirebase(Home);
