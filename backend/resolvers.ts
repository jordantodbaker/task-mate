import { Resolvers, TaskStatus } from "@/generated/graphql-backend";
import mysql from "serverless-mysql";
import { OkPacket } from "mysql";

interface ApolloContext {
  db: mysql.ServerlessMysql;
}

interface TaskDbRow {
  id: number;
  title: string;
  task_status: TaskStatus;
}

type TasksDbQueryResult = TaskDbRow[];
type TaskDbQueryResult = TaskDbRow[];

const getTaskById = async (id: number, db: mysql.ServerlessMysql) => {
  const result = await db.query<TaskDbQueryResult>(
    "SELECT id, title, task_status FROM tasks WHERE id = ?",
    [id]
  );
  return result.length
    ? {
        id: result[0].id,
        title: result[0].title,
        status: result[0].task_status,
      }
    : null;
};

export const resolvers: Resolvers<ApolloContext> = {
  Query: {
    tasks: async (parent, args, context) => {
      const { status } = args;
      let query = "SELECT id, title, task_status FROM tasks";
      let queryParams: string[] = [];
      if (status) {
        query += " WHERE task_status = ?";
        queryParams.push(status);
      }

      const tasks = await context.db.query<TasksDbQueryResult>(
        query,
        queryParams
      );
      await context.db.end();
      return tasks.map(({ id, title, task_status }) => ({
        id,
        title,
        status: task_status,
      }));
    },
    task: async (parent, args, context) => {
      return await getTaskById(args.id, context.db);
    },
  },
  Mutation: {
    createTask: async (parent, args, context) => {
      const result = await context.db.query<OkPacket>(
        "INSERT INTO tasks (title, task_status) VALUES (?, ?)",
        [args.input.title, TaskStatus.Active]
      );
      return {
        id: result.insertId,
        title: args.input.title,
        status: TaskStatus.Active,
      };
    },
    updateTask: async (parent, args, context) => {
      let columns = [];
      let queryParams = [];

      if (args.input.title) {
        columns.push(" title = ?");
        queryParams.push(args.input.title);
      }
      if (args.input.status) {
        columns.push(" task_status = ?");
        queryParams.push(args.input.status);
      }
      queryParams.push(args.input.id);
      await context.db.query(
        `UPDATE tasks SET ${columns.join(",")} WHERE id = ?`,
        queryParams
      );
      return await getTaskById(args.input.id, context.db);
    },
    deleteTask: async (parent, args, context) => {
      const task = await getTaskById(args.id, context.db);
      if (!task) {
        throw new Error("Cannot find task to delete");
      }
      await context.db.query("DELETE FROM tasks WHERE id = ?", [args.id]);
      return task;
    },
  },
};
