import React from "react";
import Link from "next/link";

const TaskFilter = () => {
  return (
    <ul className="task-filter">
      <li>
        <Link href="/" scroll={false}>
          All
        </Link>
      </li>
      <li>
        <Link
          href="/[status]"
          as="/status/active"
          scroll={false}
          shallow={true}
        >
          Active
        </Link>
      </li>
      <li>
        <Link
          href="/[status]"
          as="/status/completed"
          scroll={false}
          shallow={true}
        >
          Completed
        </Link>
      </li>
    </ul>
  );
};

export default TaskFilter;
