/* eslint-disable @typescript-eslint/no-explicit-any */
import { openDB, type DBSchema,type IDBPDatabase } from "idb";

interface CareerAdvisorDB extends DBSchema {
  "chat-messages": {
    key: string;
    value: {
      id: string;
      messages: any[];
      timestamp: Date;
    };
  };
  roadmaps: {
    key: string;
    value: {
      id: string;
      career: string;
      data: any;
      timestamp: Date;
      bookmarked: boolean;
    };
  };
  interviews: {
    key: string;
    value: {
      id: string;
      jobRole: string;
      questions: any[];
      feedback: string;
      score: number;
      timestamp: Date;
    };
  };
  bookmarks: {
    key: string;
    value: {
      id: string;
      type: "roadmap" | "interview" | "chat";
      title: string;
      data: any;
      timestamp: Date;
    };
  };
}

let db: IDBPDatabase<CareerAdvisorDB>;

export async function initDB() {
  if (db) return db;

  db = await openDB<CareerAdvisorDB>("career-advisor-db", 1, {
    upgrade(db) {
      db.createObjectStore("chat-messages", { keyPath: "id" });
      db.createObjectStore("roadmaps", { keyPath: "id" });
      db.createObjectStore("interviews", { keyPath: "id" });
      db.createObjectStore("bookmarks", { keyPath: "id" });
    },
  });

  return db;
}

// Chat Messages
export async function saveChatHistory(messages: any[]) {
  const database = await initDB();
  const id = "current-chat";
  await database.put("chat-messages", {
    id,
    messages,
    timestamp: new Date(),
  });
}

export async function loadChatHistory() {
  const database = await initDB();
  const result = await database.get("chat-messages", "current-chat");
  return result?.messages || [];
}

// Roadmaps
export async function saveRoadmap(career: string, data: any) {
  const database = await initDB();
  const id = `roadmap-${Date.now()}`;
  await database.put("roadmaps", {
    id,
    career,
    data,
    timestamp: new Date(),
    bookmarked: false,
  });
  return id;
}

export async function loadRoadmaps() {
  const database = await initDB();
  return await database.getAll("roadmaps");
}

export async function toggleRoadmapBookmark(id: string) {
  const database = await initDB();
  const roadmap = await database.get("roadmaps", id);
  if (roadmap) {
    roadmap.bookmarked = !roadmap.bookmarked;
    await database.put("roadmaps", roadmap);
  }
}

// Interviews
export async function saveInterview(
  jobRole: string,
  questions: any[],
  feedback: string,
  score: number
) {
  const database = await initDB();
  const id = `interview-${Date.now()}`;
  await database.put("interviews", {
    id,
    jobRole,
    questions,
    feedback,
    score,
    timestamp: new Date(),
  });
  return id;
}

export async function loadInterviews() {
  const database = await initDB();
  return await database.getAll("interviews");
}

// Export Functions
export function exportToJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) =>
        typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
      )
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}