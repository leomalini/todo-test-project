import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useTasks } from "@/contexts/TasksContext";

export default function TasksTable() {
  const { tasks } = useTasks();

  return (
    <div className="container ">
      <DataTable columns={columns} data={tasks} />
    </div>
  );
}
