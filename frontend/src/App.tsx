import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import Home from "./components/Home";
import SearchScreen from "./components/SearchScreen";
import WeekDetail from "./components/WeekDetail";
import TasksShell from "./components/TasksShell";
import { tasksPath } from "./lib/tasks";

function TasksRedirect() {
  return <Navigate to={tasksPath()} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen justify-center bg-[#F2F3F7]">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route element={<TasksShell />}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/tasks/:weekStart" element={<WeekDetail />} />
            <Route path="/tasks" element={<TasksRedirect />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
