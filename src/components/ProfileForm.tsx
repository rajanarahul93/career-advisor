import React, { useState, useEffect, useRef } from "react";
import type { UserProfile, FormErrors } from "../types";

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const COMMON_INTERESTS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "Design",
  "Data Science",
  "Engineering",
];
const COMMON_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "SQL",
  "Communication",
  "Problem Solving",
  "Leadership",
];
const COMMON_INDUSTRIES = [
  "Software",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Consulting",
  "Manufacturing",
  "Media",
];

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    interests: [],
    currentSkills: [],
    education: "",
    careerGoals: "",
    preferredIndustries: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Simple visibility animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleArrayToggle = (
    field: "interests" | "currentSkills" | "preferredIndustries",
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (profile.interests.length === 0)
      newErrors.interests = "Select at least one interest";
    if (profile.currentSkills.length === 0)
      newErrors.currentSkills = "Select at least one current skill";
    if (!profile.education.trim())
      newErrors.education = "Education level is required";
    if (!profile.careerGoals.trim())
      newErrors.careerGoals = "Career goals are required";
    if (profile.preferredIndustries.length === 0)
      newErrors.preferredIndustries = "Select at least one industry";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(profile);
    }
  };

  const TagSelector = ({
    label,
    options,
    selected,
    onToggle,
    error,
  }: {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    error?: string;
  }) => (
    <div
      className={`space-y-3 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <label className="block text-sm font-semibold text-gray-200">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform ${
              selected.includes(option)
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
    </div>
  );

  return (
    <div
      ref={formRef}
      className={`max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 transition-all duration-1000 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Tell us about yourself
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TagSelector
          label="What are your interests?"
          options={COMMON_INTERESTS}
          selected={profile.interests}
          onToggle={(value) => handleArrayToggle("interests", value)}
          error={errors.interests}
        />

        <TagSelector
          label="What are your current skills?"
          options={COMMON_SKILLS}
          selected={profile.currentSkills}
          onToggle={(value) => handleArrayToggle("currentSkills", value)}
          error={errors.currentSkills}
        />

        <div
          className={`space-y-3 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <label className="block text-sm font-semibold text-gray-200">
            Education Level
          </label>
          <select
            value={profile.education}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, education: e.target.value }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-300"
          >
            <option value="" className="bg-gray-700">
              Select your education level
            </option>
            <option value="High School" className="bg-gray-700">
              High School
            </option>
            <option value="Diploma" className="bg-gray-700">
              Diploma
            </option>
            <option value="Bachelor's" className="bg-gray-700">
              Bachelor's Degree
            </option>
            <option value="Master's" className="bg-gray-700">
              Master's Degree
            </option>
            <option value="PhD" className="bg-gray-700">
              PhD
            </option>
          </select>
          {errors.education && (
            <p className="text-red-400 text-sm animate-pulse">
              {errors.education}
            </p>
          )}
        </div>

        <div
          className={`space-y-3 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <label className="block text-sm font-semibold text-gray-200">
            Career Goals
          </label>
          <textarea
            value={profile.careerGoals}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, careerGoals: e.target.value }))
            }
            placeholder="Describe your career aspirations and goals..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-400 transition-all duration-300"
          />
          {errors.careerGoals && (
            <p className="text-red-400 text-sm animate-pulse">
              {errors.careerGoals}
            </p>
          )}
        </div>

        <TagSelector
          label="Preferred Industries"
          options={COMMON_INDUSTRIES}
          selected={profile.preferredIndustries}
          onToggle={(value) => handleArrayToggle("preferredIndustries", value)}
          error={errors.preferredIndustries}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105 shadow-lg active:scale-95"
        >
          Get Career Recommendations
        </button>
      </form>
    </div>
  );
}