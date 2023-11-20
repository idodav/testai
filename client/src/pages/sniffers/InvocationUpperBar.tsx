import { TextField, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { MdDomain } from "react-icons/md";
import { Sniffer } from "../../stores/sniffersStores";
import { executeInvocation } from "../../api/api";
import { useState } from "react";
import { LoadingIcon } from "./LoadingIcon";
import { AiOutlineCopy } from "react-icons/ai";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
  activeSniffer?: Sniffer;
  onExecuteRequest?: () => void;
};

const domainPath = (subdomain: string) => {
  return `https://${subdomain}.localhost.sharkio.dev`;
};

export const InvocationUpperBar = ({
  activeInvocation,
  activeSniffer,
  onExecuteRequest,
}: InvocationUpperBarProps) => {
  const [loading, setLoading] = useState(false);
  const executeRequest = () => {
    if (!activeInvocation) {
      return;
    }
    setLoading(true);
    executeInvocation(activeInvocation)
      .then(() => {
        onExecuteRequest && onExecuteRequest();
      })
      .catch(() => {
        onExecuteRequest && onExecuteRequest();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {activeSniffer && (
        <div className="flex flex-row items-center space-x-4 mb-4">
          <MdDomain className="text-blue-500 text-2xl p-1" />
          <TextField
            style={{ width: "50%" }}
            label="Sniffer's Domain:"
            size="small"
            disabled
            value={domainPath(activeSniffer.subdomain)}
          />
          <Tooltip title="Copy to clipboard" arrow placement="top">
            <div>
              <AiOutlineCopy
                className="cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(
                    domainPath(activeSniffer.subdomain)
                  )
                }
              />
            </div>
          </Tooltip>
        </div>
        //you want click to copy only on the icon or the text
      )}

      <div className="flex flex-row items-center space-x-4">
        {selectIconByMethod(activeInvocation?.method || "GET")}
        <TextField
          label={activeInvocation?.url}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
          disabled
        />
        {loading ? (
          <LoadingIcon />
        ) : (
          <PlayArrow
            className="text-green-500 cursor-pointer"
            onClick={executeRequest}
          />
        )}
      </div>
      <div className="flex flex-row space-x-4 mt-4 flex-1">
        <InvocationDetails invocation={activeInvocation} />
      </div>
    </>
  );
};
