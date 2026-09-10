"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Card from "@/components/Card/Card";
import { getTasks, type Task } from "@/lib/taskApi";

type StatusFilter = "ALL" | Task["status"];

export default function TaskBoard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");

  const {
    data: tasks,
    isPending,
    isError,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const assignees = useMemo(() => {
    if (!tasks) {
      return [];
    }

    return Array.from(
      new Set(
        tasks
          .map((task) => task.userId)
          .filter((userId): userId is number => userId !== null),
      ),
    ).sort((a, b) => a - b);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!tasks) {
      return [];
    }

    const searchTerm = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchTerm ||
        task.title.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      const matchesAssignee =
        assigneeFilter === "ALL" ||
        (assigneeFilter === "UNASSIGNED"
          ? task.userId === null
          : task.userId === Number(assigneeFilter));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAssignee
      );
    });
  }, [tasks, search, statusFilter, assigneeFilter]);

  if (isPending) {
    return (
      <Card>
        <p className="text-sm text-gray-500">
          Loading tasks...
        </p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <p className="text-sm font-medium text-red-600">
          Failed to load tasks.
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {error.message}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Tasks
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Showing {filteredTasks.length} of {tasks.length} task
          {tasks.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="task-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search tasks
          </label>

          <input
            id="task-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as StatusFilter,
              )
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
          >
            <option value="ALL">All statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="assignee-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Assignee
          </label>

          <select
            id="assignee-filter"
            value={assigneeFilter}
            onChange={(event) =>
              setAssigneeFilter(event.target.value)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
          >
            <option value="ALL">All assignees</option>
            <option value="UNASSIGNED">Unassigned</option>

            {assignees.map((userId) => (
              <option key={userId} value={userId}>
                User {userId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            No tasks found
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {task.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {task.description}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {task.status}
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Assignee:{" "}
                {task.userId !== null
                  ? `User ${task.userId}`
                  : "Unassigned"}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}