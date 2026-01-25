/**
 * EdTech Skills Assessment Application
 * Interactive self-assessment tool for educators
 */

// Application State
const state = {
    currentScreen: 'welcome',
    currentCategoryIndex: 0,
    responses: {}
};

// DOM Elements
const elements = {
    progressContainer: document.getElementById('progressContainer'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    assessmentScreen: document.getElementById('assessmentScreen'),
    resultsScreen: document.getElementById('resultsScreen'),
    categoryIcon: document.getElementById('categoryIcon'),
    categoryNumber: document.getElementById('categoryNumber'),
    categoryTitle: document.getElementById('categoryTitle'),
    categoryDescription: document.getElementById('categoryDescription'),
    skillsList: document.getElementById('skillsList'),
    stepIndicator: document.getElementById('stepIndicator'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    resultsSummary: document.getElementById('resultsSummary'),
    recommendationsGrid: document.getElementById('recommendationsGrid'),
    tryItCards: document.getElementById('tryItCards')
};

/**
 * Initialize the application
 */
function init() {
    // Load any saved progress from sessionStorage
    const savedState = sessionStorage.getItem('edtechAssessmentState');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        state.responses = parsed.responses || {};
    }
}

/**
 * Save state to sessionStorage
 */
function saveState() {
    sessionStorage.setItem('edtechAssessmentState', JSON.stringify({
        responses: state.responses
    }));
}

/**
 * Switch between screens with smooth fade transition
 */
function showScreen(screenName) {
    const allScreens = [elements.welcomeScreen, elements.assessmentScreen, elements.resultsScreen];
    const targetScreen = document.getElementById(`${screenName}Screen`);

    // Add fade-out class to currently active screen
    allScreens.forEach(screen => {
        if (screen.classList.contains('active')) {
            screen.classList.add('fade-out');
        }
    });

    // After fade-out, switch screens
    setTimeout(() => {
        // Hide all screens
        allScreens.forEach(screen => {
            screen.classList.remove('active', 'fade-out');
        });

        // Show requested screen with fade-in
        if (targetScreen) {
            targetScreen.classList.add('active', 'fade-in');
            // Remove fade-in class after animation completes
            setTimeout(() => {
                targetScreen.classList.remove('fade-in');
            }, 300);
        }

        // Update progress bar visibility
        elements.progressContainer.classList.toggle('visible', screenName === 'assessment');

        state.currentScreen = screenName;
    }, 200);
}

/**
 * Start the assessment
 */
function startAssessment() {
    state.currentCategoryIndex = 0;
    showScreen('assessment');
    renderCategory();
    updateProgress();
}

/**
 * Render the step indicator dots
 */
function renderStepIndicator() {
    const totalCategories = ASSESSMENT_CONTENT.categories.length;
    const currentIndex = state.currentCategoryIndex;

    elements.stepIndicator.innerHTML = ASSESSMENT_CONTENT.categories.map((cat, index) => {
        let stepClass = 'step-dot';
        if (index < currentIndex) {
            stepClass += ' completed';
        } else if (index === currentIndex) {
            stepClass += ' active';
        }
        return `<span class="${stepClass}" title="${cat.title}"></span>`;
    }).join('');
}

/**
 * Render the current category
 */
function renderCategory() {
    const category = ASSESSMENT_CONTENT.categories[state.currentCategoryIndex];
    const levels = ASSESSMENT_CONTENT.levels;
    const totalCategories = ASSESSMENT_CONTENT.categories.length;

    // Update header
    elements.categoryIcon.textContent = category.icon;
    elements.categoryNumber.textContent = `Category ${state.currentCategoryIndex + 1} of ${totalCategories}`;
    elements.categoryTitle.textContent = category.title;
    elements.categoryDescription.textContent = category.description;

    // Render step indicator
    renderStepIndicator();

    // Render skills
    elements.skillsList.innerHTML = category.skills.map(skill => `
        <div class="skill-item">
            <div class="skill-name">${skill.name}</div>
            <div class="skill-example">${skill.example}</div>
            <div class="skill-levels">
                ${levels.map(level => `
                    <div class="skill-level">
                        <input
                            type="radio"
                            name="${skill.id}"
                            id="${skill.id}-${level.id}"
                            value="${level.id}"
                            ${state.responses[skill.id] === level.id ? 'checked' : ''}
                            onchange="handleSkillChange('${skill.id}', ${level.id})"
                        >
                        <label for="${skill.id}-${level.id}">
                            <span class="level-icon">${level.icon}</span>
                            <span class="level-name">${level.name}</span>
                            <span class="level-desc">${level.description}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Update navigation buttons
    elements.prevBtn.classList.toggle('visible', state.currentCategoryIndex > 0);
    elements.nextBtn.textContent = state.currentCategoryIndex === totalCategories - 1
        ? 'See Results →'
        : 'Next →';
}

/**
 * Handle skill level change
 */
function handleSkillChange(skillId, levelId) {
    state.responses[skillId] = levelId;
    saveState();
    updateProgress();
}

/**
 * Update progress bar
 */
function updateProgress() {
    const totalSkills = ASSESSMENT_CONTENT.categories.reduce((sum, cat) => sum + cat.skills.length, 0);
    const answeredSkills = Object.keys(state.responses).length;
    const percentage = Math.round((answeredSkills / totalSkills) * 100);

    elements.progressFill.style.width = `${percentage}%`;
    elements.progressText.textContent = `${answeredSkills} of ${totalSkills} skills rated`;
}

/**
 * Navigate to previous category
 */
function previousCategory() {
    if (state.currentCategoryIndex > 0) {
        state.currentCategoryIndex--;
        renderCategory();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Navigate to next category or show results
 */
function nextCategory() {
    // Check if current category has all skills rated
    const category = ASSESSMENT_CONTENT.categories[state.currentCategoryIndex];
    const unanswered = category.skills.filter(skill => !state.responses[skill.id]);

    if (unanswered.length > 0) {
        // Highlight unanswered skills
        const firstUnanswered = document.querySelector(`[name="${unanswered[0].id}"]`);
        if (firstUnanswered) {
            firstUnanswered.closest('.skill-item').style.animation = 'pulse 0.5s ease';
            firstUnanswered.closest('.skill-item').scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                firstUnanswered.closest('.skill-item').style.animation = '';
            }, 500);
        }
        return;
    }

    if (state.currentCategoryIndex < ASSESSMENT_CONTENT.categories.length - 1) {
        state.currentCategoryIndex++;
        renderCategory();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        showResults();
    }
}

/**
 * Calculate category average score
 */
function getCategoryScore(categoryId) {
    const category = ASSESSMENT_CONTENT.categories.find(c => c.id === categoryId);
    if (!category) return 0;

    const scores = category.skills.map(skill => state.responses[skill.id] || 0);
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scores.length);
}

/**
 * Parse difficulty string and return appropriate tag
 * "Quick Win" for < 15 minutes, "Deep Dive" for >= 15 minutes
 */
function getDifficultyTag(difficultyStr) {
    // Extract minutes from strings like "5 minutes", "15 minutes", "10 minutes"
    const minuteMatch = difficultyStr.match(/(\d+)\s*minute/i);

    if (minuteMatch) {
        const minutes = parseInt(minuteMatch[1], 10);
        if (minutes < 15) {
            return { label: 'Quick Win', class: 'tag-quick' };
        } else {
            return { label: 'Deep Dive', class: 'tag-deep' };
        }
    }

    // For non-minute based difficulties (like "Planning time", "One activity", "One class period")
    // These typically take longer, so mark as Deep Dive
    const quickTerms = ['quick', 'fast', 'brief'];
    const isQuick = quickTerms.some(term => difficultyStr.toLowerCase().includes(term));

    if (isQuick) {
        return { label: 'Quick Win', class: 'tag-quick' };
    }

    return { label: 'Deep Dive', class: 'tag-deep' };
}

/**
 * Show the results screen
 */
function showResults() {
    showScreen('results');
    renderResults();
}

/**
 * Render results
 */
function renderResults() {
    const categories = ASSESSMENT_CONTENT.categories;
    const levelNames = ASSESSMENT_CONTENT.levelNames;

    // Render summary cards
    elements.resultsSummary.innerHTML = categories.map(category => {
        const score = getCategoryScore(category.id);
        const levelName = levelNames[score] || 'Not Rated';

        return `
            <div class="summary-card level-${score}">
                <div class="summary-icon">${category.icon}</div>
                <div class="summary-title">${category.title}</div>
                <div class="summary-level">${levelName}</div>
                <div class="summary-bar">
                    <div class="summary-bar-fill"></div>
                </div>
            </div>
        `;
    }).join('');

    // Find areas for growth (lowest scores) and strengths (highest scores)
    const categoryScores = categories.map(cat => ({
        category: cat,
        score: getCategoryScore(cat.id)
    })).sort((a, b) => a.score - b.score);

    // Get top 2-3 recommendations (focus on growth areas and mid-level skills)
    const growthAreas = categoryScores.filter(cs => cs.score <= 2).slice(0, 2);
    const developingAreas = categoryScores.filter(cs => cs.score === 3).slice(0, 1);
    const recommendationAreas = [...growthAreas, ...developingAreas].slice(0, 3);

    // If no growth areas, show recommendations for maintaining excellence
    if (recommendationAreas.length === 0) {
        recommendationAreas.push(...categoryScores.slice(-2));
    }

    // Render recommendations
    elements.recommendationsGrid.innerHTML = recommendationAreas.map(({ category, score }) => {
        const rec = category.recommendations[score] || category.recommendations[1];
        return `
            <div class="recommendation-card">
                <h3>${category.icon} ${category.title}</h3>
                <p>${rec.description}</p>
                <span class="recommendation-tag">${rec.tag}</span>
            </div>
        `;
    }).join('');

    // Render try-it activities
    elements.tryItCards.innerHTML = recommendationAreas.map(({ category, score }) => {
        const rec = category.recommendations[score] || category.recommendations[1];
        const tryIt = rec.tryIt;
        const difficultyTag = getDifficultyTag(tryIt.difficulty);
        return `
            <div class="try-it-card">
                <div class="try-it-icon">${tryIt.icon}</div>
                <div class="try-it-content">
                    <h4>${tryIt.title}</h4>
                    <p>${tryIt.description}</p>
                    <div class="try-it-meta">
                        <span class="try-it-time">⏱️ ${tryIt.difficulty}</span>
                        <span class="try-it-tag ${difficultyTag.class}">${difficultyTag.label}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Restart the assessment
 */
function restartAssessment() {
    state.responses = {};
    state.currentCategoryIndex = 0;
    sessionStorage.removeItem('edtechAssessmentState');
    showScreen('welcome');
}

/**
 * Download results as a simple text summary
 */
function downloadResults() {
    const categories = ASSESSMENT_CONTENT.categories;
    const levelNames = ASSESSMENT_CONTENT.levelNames;

    const lines = [
        '═══════════════════════════════════════════',
        '       EdTech Skills Assessment Results',
        '═══════════════════════════════════════════',
        '',
        `Date: ${new Date().toLocaleDateString()}`,
        '',
        '── Your Skill Profile ──',
        ''
    ];

    categories.forEach(category => {
        const score = getCategoryScore(category.id);
        const levelName = levelNames[score] || 'Not Rated';
        const bar = '█'.repeat(score) + '░'.repeat(4 - score);
        lines.push(`${category.icon} ${category.title}`);
        lines.push(`   ${bar} ${levelName}`);
        lines.push('');
    });

    lines.push('── Recommended Focus Areas ──');
    lines.push('');

    const categoryScores = categories.map(cat => ({
        category: cat,
        score: getCategoryScore(cat.id)
    })).sort((a, b) => a.score - b.score);

    categoryScores.slice(0, 3).forEach(({ category, score }) => {
        const rec = category.recommendations[score] || category.recommendations[1];
        lines.push(`• ${category.title}: ${rec.title}`);
        lines.push(`  ${rec.description}`);
        lines.push('');
    });

    lines.push('── This Week\'s Challenges ──');
    lines.push('');

    categoryScores.slice(0, 3).forEach(({ category, score }) => {
        const rec = category.recommendations[score] || category.recommendations[1];
        const tryIt = rec.tryIt;
        lines.push(`□ ${tryIt.title} (${tryIt.difficulty})`);
        lines.push(`  ${tryIt.description}`);
        lines.push('');
    });

    lines.push('═══════════════════════════════════════════');
    lines.push('Keep growing! Every small step counts.');
    lines.push('═══════════════════════════════════════════');

    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edtech-skills-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add pulse animation for validation feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
        50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    }
`;
document.head.appendChild(style);

// Initialize on load
init();
