import { AiOutlinePlus } from "react-icons/ai";
import { MenuItem } from "@mui/material";

interface NewProjectItemProps {
  setNewProjectModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewProjectItem: React.FC<NewProjectItemProps> = ({
  setNewProjectModalIsOpen,
}) => {
  const handleAddNewProject = () => {
    setNewProjectModalIsOpen(true);
  };

  return (
    <MenuItem onClick={() => handleAddNewProject()} value="New Project">
      <AiOutlinePlus></AiOutlinePlus> New Project
    </MenuItem>
  );
};

export default NewProjectItem;