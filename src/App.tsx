import TasksTable from "./components/tasks-table/tasks-table";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <TasksTable />
      </div>
    </div>
  );
}

export default App;
