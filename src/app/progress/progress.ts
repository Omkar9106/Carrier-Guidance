"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { FiAward, FiCheckCircle, FiStar, FiZap } from "react-icons/fi";

// Mock data (replace with real quiz results later)
const mockQuizData = [
  { id: 1, name: "Frontend Development", score: 18, total: 20, date: "2023-09-10" },
  { id: 2, name: "Backend Development", score: 15, total: 20, date: "2023-09-05" },
  { id: 3, name: "Database Management", score: 20, total: 20, date: "2023-09-15" },
  { id: 4, name: "DevOps & Cloud", score: 17, total: 20, date: "2023-09-12" },
  { id: 5, name: "System Design", score: 20, total: 20, date: "2023-09-14" },
  { id: 6, name: "Data Structures", score: 19, total: 20, date: "2023-09-16" },
  { id: 7, name: "Algorithms", score: 18, total: 20, date: "2023-09-18" },
];

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [quizData, setQuizData] = useState(mockQuizData);
  const [perfectScores, setPerfectScores] = useState(0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Stats
  const totalQuizzes = quizData.length;
  const totalPossibleScore = quizData.reduce((sum, quiz) => sum + quiz.total, 0);
  const totalEarnedScore = quizData.reduce((sum, quiz) => sum + quiz.score, 0);
  const averageScore =
    totalQuizzes > 0 ? ((totalEarnedScore / totalPossibleScore) * 100).toFixed(1) : "0.0";
  const fieldsMastered = new Set(quizData.map((q) => q.name)).size;

  // Calculate perfect scores
  useEffect(() => {
    setPerfectScores(quizData.filter((q) => q.score === q.total).length);
  }, [quizData]);

  // Save stats to Firestore whenever quizData changes
  useEffect(() => {
    const saveProgress = async () => {
      const user = auth.currentUser;
      if (!user) return; // only save for logged-in users

      try {
        const ref = doc(db, "progress", user.uid);
        await setDoc(ref, {
          totalQuizzes,
          averageScore,
          perfectScores,
          fieldsMastered,
          updatedAt: new Date(),
        });
        console.log("Progress saved to Firestore ✅");
      } catch (err) {
        console.error("Error saving progress:", err);
      }
    };

    saveProgress();
  }, [quizData, totalQuizzes, averageScore, perfectScores, fieldsMastered]);
}
