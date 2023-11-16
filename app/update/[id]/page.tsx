"use client";
import UpdateTaskForm from "@/components/UpdateTaskForm";
import { useTaskQuery } from "../../../generated/graphql-frontend";

const UpdateTask = ({ params }: { params: { id: string } }) => {
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : NaN;
  const { data, loading, error } = useTaskQuery({ variables: { id: id } });

  const task = data?.task;
  return loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>An error occured</p>
  ) : task ? (
    <UpdateTaskForm id={task.id} initialValues={{ title: task.title }} />
  ) : (
    <p>Task not found</p>
  );
  return <p>{params.id}</p>;
};

export default UpdateTask;
