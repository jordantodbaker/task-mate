import { Task, useDeleteTaskMutation } from "@/generated/graphql-frontend";
import React, { useEffect } from "react";
import Link from "next/link";
import { Reference } from "@apollo/client";

interface Props {
  task: Task;
}

const TaskListItem: React.FC<Props> = ({ task }) => {
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    variables: { id: task.id },
    errorPolicy: "all",
    update: (cache, result) => {
      const deletedTask = result.data?.deleteTask;

      if (deletedTask) {
        cache.modify({
          fields: {
            tasks(taskRefs, { readField }) {
              return taskRefs.filter((taskRef: Reference) => {
                return readField("id", taskRef) !== deletedTask.id;
              });
            },
          },
        });
      }
    },
  });

  const handleDeleteClick = async () => {
    try {
      await deleteTask();
    } catch (e) {}
  };

  useEffect(() => {
    if (error) {
      console.log(error.message);
      alert("An error occured. Please try again");
    }
  }, [error]);
  return (
    <>
      <li className="task-list-item" key={task.id}>
        <Link
          href="/update/[id]"
          as={`/update/${task.id}`}
          className="task-list-item-title"
        >
          {task.title} {task.status}{" "}
        </Link>{" "}
        <button
          className="task-list-item-delete"
          onClick={handleDeleteClick}
          disabled={loading}
        >
          &times;
        </button>
      </li>
    </>
  );
};

export default TaskListItem;
