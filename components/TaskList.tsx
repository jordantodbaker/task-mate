import { Task } from "@/generated/graphql-frontend";
import React from "react";
import Link from "next/link";
import TaskListItem from "./TaskListItem";

interface Props {
  tasks: Task[];
}

const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => {
        return <TaskListItem task={task} key={task.id} />;
      })}
    </ul>
  );
};

export default TaskList;
