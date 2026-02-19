"use client";

import { useState, useEffect, useRef } from "react";
import { ASSESSMENT_CONTENT } from "@/lib/data";

type Screen = "welcome" | "assessment" | "results";
type Responses = Record<string, number>;

function getDifficultyTag(difficultyStr: string) {
  const minuteMatch = difficultyStr.match(/(\d+)\s*minute/i);
  if (minuteMatch) {
    const minutes = parseInt(minuteMatch[1], 10);
    return minutes < 15
      ? { label: "Quick Win", cls: "tag-quick" }
      : { label: "Deep Dive", cls: "tag-deep" };
  }
  const quickTerms = ["quick", "fast", "brief"];
  const isQuick = quickTerms.some((term) =>
    difficultyStr.toLowerCase().includes(term)
  );
  return isQuick
    ? { label: "Quick Win", cls: "tag-quick" }
    : { label: "Deep Dive", cls: "tag-deep" };
}

export default function EdTechAssessment() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);
  const skillRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load saved progress from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("edtechAssessmentState");
    if (saved) {
      const parsed = JSON.parse(saved);
      setResponses(parsed.responses || {});
    }
  }, []);

  const saveState = (newResponses: Responses) => {
    sessionStorage.setItem(
      "edtechAssessmentState",
      JSON.stringify({ responses: newResponses })
    );
  };

  const startAssessment = () => {
    setCurrentCategoryIndex(0);
    setCurrentScreen("assessment");
  };

  const handleSkillChange = (skillId: string, levelId: number) => {
    const newResponses = { ...responses, [skillId]: levelId };
    setResponses(newResponses);
    saveState(newResponses);
    if (highlightedSkill === skillId) setHighlightedSkill(null);
  };

  const previousCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextCategory = () => {
    const category = ASSESSMENT_CONTENT.categories[currentCategoryIndex];
    const unanswered = category.skills.filter((skill) => !responses[skill.id]);

    if (unanswered.length > 0) {
      const firstId = unanswered[0].id;
      setHighlightedSkill(firstId);
      const el = skillRefs.current[firstId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (currentCategoryIndex < ASSESSMENT_CONTENT.categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentScreen("results");
    }
  };

  const getCategoryScore = (categoryId: string) => {
    const category = ASSESSMENT_CONTENT.categories.find(
      (c) => c.id === categoryId
    );
    if (!category) return 0;
    const scores = category.skills.map((skill) => responses[skill.id] || 0);
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scores.length);
  };

  const restartAssessment = () => {
    setResponses({});
    setCurrentCategoryIndex(0);
    sessionStorage.removeItem("edtechAssessmentState");
    setCurrentScreen("welcome");
  };

  const downloadResults = () => {
    const categories = ASSESSMENT_CONTENT.categories;
    const levelNames = ASSESSMENT_CONTENT.levelNames;

    const lines = [
      "═══════════════════════════════════════════",
      "       EdTech Skills Assessment Results",
      "═══════════════════════════════════════════",
      "",
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      "── Your Skill Profile ──",
      "",
    ];

    categories.forEach((category) => {
      const score = getCategoryScore(category.id);
      const levelName = levelNames[score] || "Not Rated";
      const bar = "█".repeat(score) + "░".repeat(4 - score);
      lines.push(`${category.icon} ${category.title}`);
      lines.push(`   ${bar} ${levelName}`);
      lines.push("");
    });

    lines.push("── Recommended Focus Areas ──");
    lines.push("");

    const categoryScores = categories
      .map((cat) => ({ category: cat, score: getCategoryScore(cat.id) }))
      .sort((a, b) => a.score - b.score);

    categoryScores.slice(0, 3).forEach(({ category, score }) => {
      const rec = category.recommendations[score] || category.recommendations[1];
      lines.push(`• ${category.title}: ${rec.title}`);
      lines.push(`  ${rec.description}`);
      lines.push("");
    });

    lines.push("── This Week's Challenges ──");
    lines.push("");

    categoryScores.slice(0, 3).forEach(({ category, score }) => {
      const rec = category.recommendations[score] || category.recommendations[1];
      const tryIt = rec.tryIt;
      lines.push(`□ ${tryIt.title} (${tryIt.difficulty})`);
      lines.push(`  ${tryIt.description}`);
      lines.push("");
    });

    lines.push("═══════════════════════════════════════════");
    lines.push("Keep growing! Every small step counts.");
    lines.push("═══════════════════════════════════════════");

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edtech-skills-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Derived values
  const totalSkills = ASSESSMENT_CONTENT.categories.reduce(
    (sum, cat) => sum + cat.skills.length,
    0
  );
  const answeredSkills = Object.keys(responses).length;
  const progressPercentage = Math.round((answeredSkills / totalSkills) * 100);

  const currentCategory = ASSESSMENT_CONTENT.categories[currentCategoryIndex];
  const levels = ASSESSMENT_CONTENT.levels;

  // Results data
  const categoryScores = ASSESSMENT_CONTENT.categories
    .map((cat) => ({ category: cat, score: getCategoryScore(cat.id) }))
    .sort((a, b) => a.score - b.score);

  const growthAreas = categoryScores.filter((cs) => cs.score <= 2).slice(0, 2);
  const developingAreas = categoryScores
    .filter((cs) => cs.score === 3)
    .slice(0, 1);
  let recommendationAreas = [...growthAreas, ...developingAreas].slice(0, 3);
  if (recommendationAreas.length === 0) {
    recommendationAreas = categoryScores.slice(-2);
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">EdTech Skills</span>
        </div>
        <p className="tagline">Discover your strengths and unlock new possibilities</p>
      </header>

      {/* Progress Bar */}
      <div
        className={`progress-container${currentScreen === "assessment" ? " visible" : ""}`}
      >
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="progress-text">
          {answeredSkills} of {totalSkills} skills rated
        </span>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Screen */}
        {currentScreen === "welcome" && (
          <section className="screen active fade-in">
            <div className="welcome-card">
              <h1>Welcome, Educator!</h1>
              <p className="welcome-intro">
                This quick assessment will help identify your strengths in
                educational technology and suggest personalized ways to grow
                your skills.
              </p>
              <div className="features-preview">
                <div className="feature">
                  <span className="feature-icon">⏱️</span>
                  <span>5 minutes</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span>6 skill areas</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💡</span>
                  <span>Personalized tips</span>
                </div>
              </div>
              <button
                className="btn btn-primary btn-large"
                onClick={startAssessment}
              >
                Begin Assessment <span className="btn-arrow">→</span>
              </button>
            </div>
          </section>
        )}

        {/* Assessment Screen */}
        {currentScreen === "assessment" && (
          <section className="screen active fade-in">
            <div className="assessment-card">
              {/* Category Header */}
              <div className="category-header">
                <span className="category-icon">{currentCategory.icon}</span>
                <div className="category-info">
                  <div className="category-progress">
                    <span className="category-number">
                      Category {currentCategoryIndex + 1} of{" "}
                      {ASSESSMENT_CONTENT.categories.length}
                    </span>
                    <div className="step-indicator">
                      {ASSESSMENT_CONTENT.categories.map((cat, index) => (
                        <span
                          key={cat.id}
                          className={`step-dot${
                            index < currentCategoryIndex
                              ? " completed"
                              : index === currentCategoryIndex
                              ? " active"
                              : ""
                          }`}
                          title={cat.title}
                        />
                      ))}
                    </div>
                  </div>
                  <h2 className="category-title">{currentCategory.title}</h2>
                </div>
              </div>

              <p className="category-description">
                {currentCategory.description}
              </p>

              {/* Skills List */}
              <div className="skills-list">
                {currentCategory.skills.map((skill) => (
                  <div
                    key={skill.id}
                    ref={(el) => { skillRefs.current[skill.id] = el; }}
                    className="skill-item"
                    style={
                      highlightedSkill === skill.id
                        ? { animation: "pulse 0.5s ease" }
                        : {}
                    }
                  >
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-example">{skill.example}</div>
                    <div className="skill-levels">
                      {levels.map((level) => (
                        <div key={level.id} className="skill-level">
                          <input
                            type="radio"
                            name={skill.id}
                            id={`${skill.id}-${level.id}`}
                            value={level.id}
                            checked={responses[skill.id] === level.id}
                            onChange={() =>
                              handleSkillChange(skill.id, level.id)
                            }
                          />
                          <label htmlFor={`${skill.id}-${level.id}`}>
                            <span className="level-icon">{level.icon}</span>
                            <span className="level-name">{level.name}</span>
                            <span className="level-desc">
                              {level.description}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="assessment-nav">
                <button
                  className="btn btn-secondary"
                  style={{
                    visibility:
                      currentCategoryIndex > 0 ? "visible" : "hidden",
                  }}
                  onClick={previousCategory}
                >
                  <span className="btn-arrow">←</span> Previous
                </button>
                <button className="btn btn-primary" onClick={nextCategory}>
                  {currentCategoryIndex ===
                  ASSESSMENT_CONTENT.categories.length - 1
                    ? "See Results"
                    : "Next"}{" "}
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Results Screen */}
        {currentScreen === "results" && (
          <section className="screen active fade-in">
            <div className="results-container">
              <div className="results-header">
                <h1>Your EdTech Profile</h1>
                <p>
                  Based on your responses, here&apos;s your personalized skills
                  snapshot
                </p>
              </div>

              {/* Summary Cards */}
              <div className="results-summary">
                {ASSESSMENT_CONTENT.categories.map((category) => {
                  const score = getCategoryScore(category.id);
                  const levelName =
                    ASSESSMENT_CONTENT.levelNames[score] || "Not Rated";
                  return (
                    <div
                      key={category.id}
                      className={`summary-card level-${score}`}
                    >
                      <div className="summary-icon">{category.icon}</div>
                      <div className="summary-title">{category.title}</div>
                      <div className="summary-level">{levelName}</div>
                      <div className="summary-bar">
                        <div className="summary-bar-fill" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="recommendations-section">
                <h2>🚀 Recommended Next Steps</h2>
                <div className="recommendations-grid">
                  {recommendationAreas.map(({ category, score }) => {
                    const rec =
                      category.recommendations[score] ||
                      category.recommendations[1];
                    return (
                      <div key={category.id} className="recommendation-card">
                        <h3>
                          {category.icon} {category.title}
                        </h3>
                        <p>{rec.description}</p>
                        <span className="recommendation-tag">{rec.tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Try It This Week */}
              <div className="try-it-section">
                <h2>💪 Try It This Week</h2>
                <div className="try-it-cards">
                  {recommendationAreas.map(({ category, score }) => {
                    const rec =
                      category.recommendations[score] ||
                      category.recommendations[1];
                    const tryIt = rec.tryIt;
                    const difficultyTag = getDifficultyTag(tryIt.difficulty);
                    return (
                      <div key={category.id} className="try-it-card">
                        <div className="try-it-icon">{tryIt.icon}</div>
                        <div className="try-it-content">
                          <h4>{tryIt.title}</h4>
                          <p>{tryIt.description}</p>
                          <div className="try-it-meta">
                            <span className="try-it-time">
                              ⏱️ {tryIt.difficulty}
                            </span>
                            <span
                              className={`try-it-tag ${difficultyTag.cls}`}
                            >
                              {difficultyTag.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="results-actions">
                <button
                  className="btn btn-secondary"
                  onClick={restartAssessment}
                >
                  Retake Assessment
                </button>
                <button className="btn btn-primary" onClick={downloadResults}>
                  Download My Profile
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Empowering educators to embrace technology with confidence</p>
      </footer>
    </div>
  );
}
