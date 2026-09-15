"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export default function StudyGroupDetailsPage() {
  const params = useParams();
  const { token, isAuthenticated } = useAuth();

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudyGroup = async () => {
      try {
        const response = await fetch(
          `${API_URL}/study-groups/${params.id}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch study group");
        }

        const data = await response.json();
        setGroup(data);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching study group:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStudyGroup();

    return () => {
      controller.abort();
    };
  }, [params.id]);

   useEffect(() => {
  if (!isAuthenticated || !token || !params.id) {
    return;
  }

  const controller = new AbortController();

  const checkMembership = async () => {
    try {
      const response = await fetch(
        `${API_URL}/study-groups/${params.id}/membership`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check membership");
      }

      const data = await response.json();

      setIsMember(data.isMember);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Error checking membership:", error);
    }
  };

  checkMembership();

  return () => {
    controller.abort();
  };
}, [params.id, token, isAuthenticated]);

  const handleJoin = async () => {
    if (!token) {
      alert("Please login to join this study group.");
      return;
    }

    setMembershipLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/study-groups/${params.id}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Failed to join study group"
        );
      }

      setIsMember(true);

      setGroup((prev) =>
        prev
          ? {
              ...prev,
              members: data.members,
            }
          : prev
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to join study group"
      );
    } finally {
      setMembershipLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!token) {
      return;
    }

    setMembershipLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/study-groups/${params.id}/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Failed to leave study group"
        );
      }

      setIsMember(false);

      setGroup((prev) =>
        prev
          ? {
              ...prev,
              members: data.members,
            }
          : prev
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to leave study group"
      );
    } finally {
      setMembershipLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/groups"
            className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Study Groups
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-gray-500">
              Loading study group...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !group) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/groups"
            className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Study Groups
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Study group not found
            </h1>

            <p className="mt-2 text-gray-500">
              The study group you are looking for does not exist.
            </p>

            <Link
              href="/groups"
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Browse Study Groups
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/groups"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Study Groups
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                {group.level}
              </span>

              <span className="text-sm font-medium text-gray-500">
                👥 {group.members} members
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {group.name}
            </h1>

            <p className="mt-2 font-medium text-gray-700">
              {group.course}
            </p>

            <p className="mt-5 max-w-2xl leading-7 text-gray-600">
              {group.description}
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="text-sm text-gray-500">
                Study Level
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {group.level}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Members
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {group.members} students
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Meeting Day
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {group.meetingDay}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Meeting Time
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {group.meetingTime}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Meeting Location
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {group.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Group Creator
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {group.user.firstName} {group.user.lastName}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              {isMember
                ? "You are a member"
                : "Interested in joining?"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isMember
                ? "You have joined this study group."
                : "Join this study group and start learning with other students."}
            </p>

            {!isAuthenticated ? (
              <button
                onClick={() =>
                  alert("Please login to join this study group.")
                }
                className="mt-5 w-full rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
              >
                🙋 Login to Join
              </button>
            ) : isMember ? (
              <button
                onClick={handleLeave}
                disabled={membershipLoading}
                className="mt-5 w-full rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {membershipLoading
                  ? "Leaving..."
                  : "Leave Group"}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={membershipLoading}
                className="mt-5 w-full rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {membershipLoading
                  ? "Joining..."
                  : "🙋 Join Group"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
