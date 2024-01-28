import { useState } from "react";
import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { IoSaveOutline } from "react-icons/io5";
import { Button, Input, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextButton } from "../../components/TextButton";
import { selectIconByMethod } from "../sniffers/selectIconByMethod";
import { MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { RequestSection } from "../sniffers/InvocationDetails";
import { InvocationType } from "../sniffers/types";
import { InvocationURL } from "../live-Invocations/LiveInvocationUpperBar";
import { SelectComponent } from "../../components/select-component/SelectComponent";

const FLOW = {
  id: "673bf1a6-8662-41a2-a1eb-6e7acba75629",
  name: "Test flow 1",
  executionType: "sequence",
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  createdAt: "2024-01-26T12:57:18.932Z",
  updatedAt: "2024-01-26T12:57:18.932Z",
};

const FLOW_STEP = {
  id: "d70692d2-5ab8-44ba-ad0e-3e9cb0ab91d4",
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  flowId: "673bf1a6-8662-41a2-a1eb-6e7acba75629",
  proxyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "Test name",
  url: "/URL",
  body: "",
  subdomain: "ron-demo-9usub",
  snifferId: "8b5ea683-d68d-43fe-b18d-ab516540aac3",
  headers: {},
  assertions: [
    {
      path: "body.example",
      comparator: "eq",
      expectedValue: "example",
    },
  ],
  method: "GET",
  createdAt: "2024-01-26T14:22:52.255Z",
  updatedAt: "2024-01-26T14:22:52.255Z",
};

interface Flow {
  id: string;
  name: string;
  executionType: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface FlowStep {
  id: string;
  ownerId: string;
  flowId: string;
  proxyId: string;
  name: string;
  url: string;
  body: string;
  subdomain: string;
  headers: object;
  assertions: any[];
  method: string;
  createdAt: string;
  updatedAt: string;
}

export const FlowStepPage = () => {
  const [flowStep, setFlowStep] = useState<FlowStep>(FLOW_STEP);
  return (
    <PanelGroup
      direction={"vertical"}
      className="max-w-[calc(100vw-56px)] min-h-[calc(100vh-184px)] max-h-[calc(100vh-184px)]"
    >
      <Panel defaultSize={60} maxSize={70}>
        <div className="flex flex-col p-4 w-full h-full pb-0">
          <InvocationURL
            invocation={flowStep}
            setEditedInvocation={setFlowStep}
            showUrlButtons={false}
          />
          <RequestSection invocation={flowStep} setInvocation={setFlowStep} />
        </div>
      </Panel>
      <div className="relative h-[1px] w-full my-4 hover:bg-blue-300 bg-border-color">
        <PanelResizeHandle
          className={`absolute h-[30px] w-full top-[-15px] `}
        />
      </div>
      <Panel maxSize={70}>
        <div className="flex flex-col px-2 w-full h-full space-y-2">
          <div className="flex flex-row items-center space-x-2">
            <TextButton
              text="Header Assertion"
              onClick={() => {
                setFlowStep({
                  ...flowStep,
                  assertions: [
                    ...flowStep.assertions!,
                    {
                      path: "headers.example",
                      comparator: "eq",
                      expectedValue: "example",
                    },
                  ],
                });
              }}
            />
            <TextButton
              text="Body Assertion"
              onClick={() => {
                setFlowStep({
                  ...flowStep,
                  assertions: [
                    ...flowStep.assertions!,
                    {
                      path: "body.example",
                      comparator: "eq",
                      expectedValue: "example",
                    },
                  ],
                });
              }}
            />
            <TextButton
              text="Status Assertion"
              onClick={() => {
                setFlowStep({
                  ...flowStep,
                  assertions: [
                    ...flowStep.assertions!,
                    {
                      path: "status",
                      comparator: "eq",
                      expectedValue: "200",
                    },
                  ],
                });
              }}
            />
          </div>
          {flowStep.assertions?.map((assertion) => (
            <div className="flex flex-row items-center space-x-2 w-full">
              <div className="flex flex-row items-center space-x-2 w-full">
                <input
                  className="border border-border-color rounded-md px-2 py-1 w-full"
                  placeholder="Name"
                  value={assertion.path}
                  onChange={(event) => {
                    console.log(event.target.value);
                  }}
                />
                <div className="flex flex-row min-w-28 h-full">
                  <SelectComponent
                    options={[
                      { label: "eq", value: "eq" },
                      { label: "neq", value: "neq" },
                    ]}
                    value={assertion.comparator}
                    onChange={(value) => {}}
                    variant="outlined"
                  />
                </div>

                <input
                  className="border border-border-color rounded-md px-2 py-1 w-full"
                  placeholder="Value"
                  value={assertion.expectedValue}
                  onChange={(event) => {
                    console.log(event.target.value);
                  }}
                />
                <div className="flex flex-row min-w-[20px] h-full">
                  <AiOutlineDelete
                    className="flex text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                    onClick={() => {
                      setFlowStep({
                        ...flowStep,
                        assertions: flowStep.assertions?.filter(
                          (a) => a !== assertion,
                        ),
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </PanelGroup>
  );
};

const FlowPage = () => {
  return (
    <InnerPageTemplate
      sideBarComponent={FlowSideBar}
      contentComponent={FlowContent}
    />
  );
};

const FlowSideBar: React.FC = () => {
  const [isNew, setIsNew] = useState(true);
  return (
    <div className="flex flex-col space-y-4 px-2">
      <div className="flex flex-col">
        <div className="text-2xl font-bold mb-2">Flows</div>
        <div className="border-b border-border-color pb-2 mb-2">
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md`}
          >
            <div
              className={`flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center`}
            >
              <AiOutlinePlus className="text-blue-500 h-8 w-8 p-1" />
              New Flow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlowContent: React.FC = () => {
  const [flow, setFlow] = useState<Partial<Flow>>(FLOW);
  const [isLoading, setIsLoading] = useState(false);
  const [tabNumber, setTabNumber] = useState("1");

  const handleTabChange = (_: any, newValue: string) => {
    setTabNumber(newValue);
  };

  const handleFlowNameChange = (name: string) => {
    setFlow({ ...flow, name });
  };

  const handleSaveClicked = () => {
    setIsLoading(true);
    console.log("save clicked");
    setIsLoading(false);
  };

  return (
    <>
      <FlowNameAndSave
        isLoading={isLoading}
        name={flow.name!}
        handleNameChange={handleFlowNameChange}
        handleSaveClicked={handleSaveClicked}
      />
      <TabContext value={tabNumber}>
        <TabList onChange={handleTabChange}>
          <Tab label="Tests" value="1" />
          <Tab label="Runs" value="2" />
        </TabList>
        <TestsTab steps={[FLOW_STEP]} />
        <RunsTab />
      </TabContext>
    </>
  );
};

interface TestsTab {
  steps: FlowStep[];
}

const TestsTab: React.FC<TestsTab> = ({ steps }) => {
  const navigate = useNavigate();

  return (
    <TabPanel value="1" style={{ padding: 0, paddingTop: 16, height: "100%" }}>
      <TextButton text="Add Test" onClick={() => {}} />
      {steps.map((step) => (
        <div className="flex flex-col border border-border-color p-2 px-4 mt-4 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[48px] active:cursor-grabbing justify-center">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col justify-center">
              <div className="flex flex-row items-center space-x-2">
                <div className="text-lg font-bold">{step.name}</div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                {selectIconByMethod(step.method)}
                <div className="text-sm text-gray-400">Proxy Name</div>
                <div className="text-sm text-gray-400 truncate max-w-[75ch]">
                  {step.url}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <AiOutlineDelete className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md" />
              <MdChevronRight
                className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
                onClick={() => navigate("/flows/123/tests/123")}
              />
            </div>
          </div>
        </div>
      ))}
    </TabPanel>
  );
};
const RunsTab: React.FC = () => {
  return (
    <TabPanel value="2" style={{ padding: 0, paddingTop: 16, height: "100%" }}>
      Runs
    </TabPanel>
  );
};

interface FlowNameAndSaveProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
  isNew?: boolean;
  handleCreateClicked?: () => void;
}

const FlowNameAndSave: React.FC<FlowNameAndSaveProps> = ({
  isLoading,
  name,
  handleNameChange,
  handleSaveClicked,
  isNew = true,
  handleCreateClicked,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <EditableNameField
        isLoading={isLoading}
        name={name}
        handleNameChange={handleNameChange}
        handleSaveClicked={handleSaveClicked}
      />
      {!isNew && (
        <Button
          variant="outlined"
          color="success"
          sx={{ height: "32px" }}
          onAbort={handleSaveClicked}
        >
          Save
        </Button>
      )}
      {isNew && (
        <Button
          variant="outlined"
          color="success"
          sx={{ height: "32px" }}
          onAbort={handleCreateClicked}
        >
          Create
        </Button>
      )}
    </div>
  );
};

interface EditableNameProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
}

const EditableNameField: React.FC<EditableNameProps> = ({
  isLoading = true,
  name,
  handleNameChange,
  handleSaveClicked,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const onSaveClicked = (e: any) => {
    e.stopPropagation();
    handleSaveClicked();
    setIsEditing(false);
  };

  return (
    <div className="flex flex-row items-center space-x-2 justify-center h-8">
      {isEditing ? (
        <>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <IoSaveOutline
              className="text-blue-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
              onClick={onSaveClicked}
            />
          )}
          <Input
            className="w-[30ch] border-none focus:ring-0"
            defaultValue={name}
            onChange={(e: any) => handleNameChange(e.target.value)}
          />
        </>
      ) : (
        <>
          <AiOutlineEdit
            onClick={(e: any) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className=" text-blue-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
          />
          <span className="truncate max-w-[50ch]">{name}</span>
        </>
      )}
    </div>
  );
};

export default FlowPage;