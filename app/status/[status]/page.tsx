"use client";
import { useRef, useEffect } from "react";
import { useTasksQuery } from "@/generated/graphql-frontend";
import TaskList from "@/components/TaskList";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskFilter from "@/components/TaskFilter";
import { TaskStatus } from "@/generated/graphql-frontend";
import Error from "next/error";

const isTaskStatus = (value: string): value is TaskStatus =>
  Object.values(TaskStatus).includes(value as TaskStatus);

export default function Home({ params }: { params: { status: string } }) {
  const status = typeof params.status === "string" ? params.status : undefined;
  if (status !== undefined && !isTaskStatus(status)) {
    return <Error statusCode={404} />;
  }

  const prevStatus = useRef(status);

  useEffect(() => {
    prevStatus.current = status;
  }, [status]);

  const result = useTasksQuery({
    variables: { status },
    // fetchPolicy:
    //   prevStatus.current === status ? "cache-first" : "cache-and-network",
  });

  const tasks = result.data?.tasks;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <CreateTaskForm onSuccess={result.refetch} />
        {result.loading ? (
          <p>Loading Tasks...</p>
        ) : result.error ? (
          <p>An error occured.</p>
        ) : tasks && tasks.length > 0 ? (
          <TaskList tasks={tasks} />
        ) : (
          <p className="no-tasks-message">You've got no tasks</p>
        )}
        <TaskFilter />
      </div>
    </main>
  );
}
