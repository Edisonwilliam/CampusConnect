"use client";

import { useAuth } from "../components/AuthProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

type StudyGroup = {
  id: number;
  name: string;
  course: string;
  level: string;
  description: string;
  members: number;
  meetingDay: string;
  meetingTime: string;
  location: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

export default function StudyGroupsPage() {
  const { token, isAuthenticated } = useAuth();

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    level: "",
    description: "",
    meetingDay: "",
    meetingTime: "",
    location: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudyGroups = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/study-groups",
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch study groups: ${response.status}`
          );
        }

        const data = await response.json();
        setStudyGroups(data);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching study groups:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStudyGroups();

    return () => {
      controller.abort();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/study-groups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message ||
              "Failed to create study group"
        );
      }

      setStudyGroups((prev) => [data, ...prev]);

      setFormData({
        name: "",
        course: "",
        level: "",
        description: "",
        meetingDay: "",
        meetingTime: "",
        location: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error creating study group:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create study group"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Study Groups
            </h1>

            <p className="mt-2 max-w-2xl text-gray-600">
              Find study groups, connect with other students, and
              learn together.
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              {showForm
                ? "Close Form"
                : "+ Add New Study Group"}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Study Group
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a study group and invite other students to
              learn together.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 sm:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Group Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Computer Engineering Study Group"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Course
                </label>

                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Computer Engineering"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Level
                </label>

                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  placeholder="300 Level"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meeting Day
                </label>

                <input
                  type="text"
                  name="meetingDay"
                  value={formData.meetingDay}
                  onChange={handleChange}
                  placeholder="Saturday"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meeting Time
                </label>

                <input
                  type="text"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleChange}
                  placeholder="4 PM"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="UNIBEN Library"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what the study group is about..."
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Creating..."
                    : "Create Study Group"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading study groups...
            </p>
          </div>
        ) : studyGroups.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No study groups yet
            </h2>

            <p className="mt-2 text-gray-500">
              Be the first to create a study group.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studyGroups.map((group) => (
              <div
                key={group.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {group.course}
                  </span>

                  <span className="text-sm text-gray-500">
                    {group.level}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  {group.name}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                  {group.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-900">
                      Members:
                    </span>{" "}
                    {group.members}
                  </p>

                  <p>
                    <span className="font-medium text-gray-900">
                      Meeting:
                    </span>{" "}
                    {group.meetingDay} at {group.meetingTime}
                  </p>

                  <p>
                    <span className="font-medium text-gray-900">
                      Location:
                    </span>{" "}
                    {group.location}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500">
                    Created by
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {group.user.firstName} {group.user.lastName}
                  </p>
                </div>

                <Link
                  href={`/groups/${group.id}`}
                  className="mt-6 rounded-xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  View Study Group
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
