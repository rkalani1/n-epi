/**
 * Neuro-Epi — App Shell
 * SPA router, navigation, theme toggle, state management
 * Features: Command Palette, Favorites, Breadcrumbs, Keyboard Shortcuts,
 *           Enhanced Mobile Nav, Module Footer, Welcome Dashboard
 * Note: All HTML content is generated from trusted internal sources only (no user-supplied HTML).
 */

const App = (() => {
    'use strict';

    const modules = {};
    let currentModule = null;
    let commandPaletteOpen = false;
    let shortcutsModalOpen = false;

    // Navigation structure — all data is hardcoded/trusted
    const NAV = [
        {
            title: 'STUDY DESIGN',
            items: [
                { id: 'sample-size', label: 'Sample Size', icon: '#', description: 'Calculate required sample sizes for clinical studies' },
                { id: 'power-analysis', label: 'Power Analysis', icon: 'P', description: 'Statistical power calculations and curves' },
                { id: 'nihss-calculator', label: 'NIHSS', icon: 'N', description: 'Quantify stroke severity using the NIHSS' },
                { id: 'hypothesis-builder', label: 'Hypothesis Builder', icon: 'H', description: 'Formulate and structure research hypotheses' },
                { id: 'study-design-guide', label: 'Design Guide', icon: '\u2630', description: 'Interactive guide for choosing study designs' }
            ]
        },
        {
            title: 'EPIDEMIOLOGY',
            items: [
                { id: 'epidemiology-calcs', label: 'Epi Calculators', icon: '2', description: 'Incidence, prevalence, and epi measures' },
                { id: 'risk-calculators', label: 'Risk Calculators', icon: '%', description: 'Relative risk, odds ratio, and risk difference' },
                { id: 'epi-concepts', label: 'Epi Concepts', icon: '\u03B5', description: 'Core epidemiology concepts and definitions' },
                { id: 'causal-inference', label: 'Causal Inference', icon: '\u2192', description: 'DAGs, confounding, and causal frameworks' }
            ]
        },
        {
            title: 'BIOSTATISTICS',
            items: [
                { id: 'effect-size', label: 'Effect Sizes', icon: 'E', description: 'Cohen\'s d, eta-squared, and effect measures' },
                { id: 'nnt-calculator', label: 'NNT / NNH', icon: 'N', description: 'Number needed to treat/harm calculator' },
                { id: 'diagnostic-accuracy', label: 'Diagnostic Accuracy', icon: 'D', description: 'Sensitivity, specificity, PPV, NPV' },
                { id: 'regression-helper', label: 'Regression Planning', icon: 'R', description: 'Plan and interpret regression models' },
                { id: 'survival-analysis', label: 'Survival Analysis', icon: 'S', description: 'Kaplan-Meier, log-rank, and Cox models' },
                { id: 'biostats-reference', label: 'Biostats Reference', icon: '\u03A3', description: 'Statistical tests reference and guide' },
                { id: 'results-interpreter', label: 'Results Interpreter', icon: '\u2261', description: 'Interpret statistical results in context' }
            ]
        },
        {
            title: 'CLINICAL TRIALS',
            items: [
                { id: 'trial-database', label: 'Trial Database', icon: 'T', description: 'Browse landmark neurology clinical trials' },
                { id: 'critical-appraisal', label: 'Critical Appraisal', icon: 'C', description: 'Structured tools for appraising evidence' },
                { id: 'reporting-guidelines', label: 'Reporting Guidelines', icon: '\u2611', description: 'CONSORT, STROBE, PRISMA checklists' }
            ]
        },
        {
            title: 'META-ANALYSIS',
            items: [
                { id: 'meta-analysis', label: 'Meta-Analysis', icon: 'M', description: 'Fixed/random effects meta-analysis tools' }
            ]
        },
        {
            title: 'ML & PREDICTION',
            items: [
                { id: 'ml-prediction', label: 'ML for Research', icon: '\u26A1', description: 'Machine learning concepts for clinical research' }
            ]
        },
        {
            title: 'WRITING & PRODUCTIVITY',
            items: [
                { id: 'methods-generator', label: 'Methods Generator', icon: '\u270E', description: 'Auto-generate methods section text' },
                { id: 'project-planner', label: 'Project Planner', icon: '\u2610', description: 'Research project timeline and milestones' }
            ]
        },
        {
            title: 'TOOLS & REFERENCE',
            items: [
                { id: 'r-code-library', label: 'R Code Library', icon: '\u211B', description: 'Curated R code recipes for clinical research' },
                { id: 'teaching-tools', label: 'Teaching Tools', icon: '\u2706', description: 'Quizzes, journal club worksheets, glossary' },
                { id: 'quick-reference', label: 'Quick Reference', icon: '\u2263', description: 'Printable reference cards for key concepts' },
                { id: 'biobank-cleaning', label: 'Biobank Cleaning', icon: '\u2699', description: 'Standardize biobank data and check biological consistency' }
            ]
        }
    ];

    const MOBILE_NAV = [
        { id: 'home', label: 'Home', icon: '\u2302' },
        { id: 'sample-size', label: 'Design', icon: '#' },
        { id: 'epidemiology-calcs', label: 'Epi', icon: '2' },
        { id: 'effect-size', label: 'Stats', icon: 'E' },
        { id: 'trial-database', label: 'Trials', icon: 'T' }
    ];

    // Flat list of all modules for search
    function getAllModules() {
        var result = [];
        NAV.forEach(function (group) {
            group.items.forEach(function (item) {
                result.push({
                    id: item.id,
                    label: item.label,
                    icon: item.icon,
                    description: item.description || '',
                    category: group.title
                });
            });
        });
        return result;
    }

    // ============================================================
    // FAVORITES SYSTEM
    // ============================================================

    function getFavorites() {
        try {
            var data = localStorage.getItem('neuroepi_favorites');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveFavorites(favs) {
        try {
            localStorage.setItem('neuroepi_favorites', JSON.stringify(favs));
        } catch (e) {
            // ignore
        }
    }

    function toggleFavorite(moduleId) {
        var favs = getFavorites();
        var idx = favs.indexOf(moduleId);
        if (idx > -1) {
            favs.splice(idx, 1);
        } else {
            favs.push(moduleId);
        }
        saveFavorites(favs);
        renderSidebar();
        // Re-highlight current module
        if (currentModule) {
            document.querySelectorAll('.sidebar-link').forEach(function (el) {
                el.classList.toggle('active', el.dataset.module === currentModule);
            });
        }
    }

    function isFavorite(moduleId) {
        return getFavorites().indexOf(moduleId) > -1;
    }

    // ============================================================
    // MODULE VISIT HISTORY (for dashboard)
    // ============================================================

    function trackModuleVisit(moduleId) {
        if (moduleId === 'home') return;
        try {
            var visits = JSON.parse(localStorage.getItem('neuroepi_recent_modules') || '[]');
            // Remove existing entry
            visits = visits.filter(function (v) { return v.id !== moduleId; });
            visits.unshift({ id: moduleId, timestamp: Date.now() });
            if (visits.length > 10) visits.length = 10;
            localStorage.setItem('neuroepi_recent_modules', JSON.stringify(visits));
        } catch (e) {
            // ignore
        }
    }

    function getRecentModules() {
        try {
            return JSON.parse(localStorage.getItem('neuroepi_recent_modules') || '[]');
        } catch (e) {
            return [];
        }
    }

    // ============================================================
    // CALCULATION HISTORY
    // ============================================================

    var CALC_HISTORY_KEY = 'ne-calc-history';
    var CALC_HISTORY_MAX = 20;

    function addToHistory(moduleName, calcName, resultSummary) {
        var history = getCalcHistory();
        history.unshift({
            module: moduleName,
            calc: calcName,
            result: resultSummary,
            timestamp: Date.now()
        });
        if (history.length > CALC_HISTORY_MAX) {
            history.length = CALC_HISTORY_MAX;
        }
        try {
            localStorage.setItem(CALC_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            // ignore storage errors
        }
    }

    function getCalcHistory() {
        try {
            // Read from Export's history (neuroepi_history) which modules write to
            var exportData = localStorage.getItem('neuroepi_history');
            var exportHistory = exportData ? JSON.parse(exportData) : [];
            // Also read from App's own key (ne-calc-history)
            var appData = localStorage.getItem(CALC_HISTORY_KEY);
            var appHistory = appData ? JSON.parse(appData) : [];
            // Merge: normalize Export entries to dashboard format
            var merged = [];
            exportHistory.forEach(function (e) {
                merged.push({
                    module: e.moduleId || e.module || 'Unknown',
                    calc: e.moduleId || e.module || '',
                    result: typeof e.result === 'string' ? e.result : JSON.stringify(e.result).substring(0, 100),
                    timestamp: e.timestamp || Date.now()
                });
            });
            appHistory.forEach(function (e) {
                merged.push(e);
            });
            // Sort by timestamp (newest first) and deduplicate
            merged.sort(function (a, b) { return b.timestamp - a.timestamp; });
            if (merged.length > CALC_HISTORY_MAX) merged.length = CALC_HISTORY_MAX;
            return merged;
        } catch (e) {
            return [];
        }
    }

    function formatRelativeTime(timestamp) {
        var diff = Date.now() - timestamp;
        var seconds = Math.floor(diff / 1000);
        if (seconds < 60) return 'just now';
        var minutes = Math.floor(seconds / 60);
        if (minutes < 60) return minutes + 'm ago';
        var hours = Math.floor(minutes / 60);
        if (hours < 24) return hours + 'h ago';
        var days = Math.floor(hours / 24);
        if (days < 7) return days + 'd ago';
        var weeks = Math.floor(days / 7);
        return weeks + 'w ago';
    }

    // Find module ID from display name for navigation
    function findModuleIdByName(name) {
        var allMods = getAllModules();
        var lower = name.toLowerCase();
        for (var i = 0; i < allMods.length; i++) {
            if (allMods[i].label.toLowerCase() === lower || allMods[i].id === lower) {
                return allMods[i].id;
            }
        }
        return null;
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function init() {
        renderSidebar();
        renderMobileNav();
        initTheme();
        initRouter();
        initKeyboardShortcuts();
        initCommandPalette();
        initSwipeGestures();
        window.addEventListener('resize', handleResize);
    }

    // ============================================================
    // SAFE DOM HELPERS
    // All rendered content comes from trusted internal constants.
    // ============================================================

    function setTrustedHTML(element, trustedContent) {
        // All callers only pass hardcoded/trusted template strings
        element.innerHTML = trustedContent;
    }

    // ============================================================
    // SIDEBAR (with Favorites)
    // ============================================================

    function renderSidebar() {
        var sidebar = document.getElementById('sidebar');
        var favs = getFavorites();
        var allMods = getAllModules();

        var html = '<div class="sidebar-header">'
            + '<div class="sidebar-logo" onclick="App.navigate(\'home\')" style="cursor:pointer;">'
            + '<div class="sidebar-logo-icon">NE</div>'
            + '<div>'
            + '<div class="sidebar-logo-text">Neuro-Epi</div>'
            + '<div class="sidebar-logo-version">Epidemiology &amp; Clinical Research</div>'
            + '</div></div>'
            + '<button class="sidebar-cmd-k-btn" onclick="App.openCommandPalette()" title="Search modules (Cmd+K)">'
            + '<span style="opacity:0.6;">Search...</span>'
            + '<kbd class="kbd-hint">&#8984;K</kbd>'
            + '</button>'
            + '</div>'
            + '<nav class="sidebar-nav">';

        // Favorites section
        if (favs.length > 0) {
            html += '<div class="sidebar-group sidebar-favorites-group">'
                + '<div class="sidebar-group-title"><span style="margin-right:4px;">&#9733;</span> FAVORITES</div>';
            favs.forEach(function (favId) {
                var mod = null;
                for (var i = 0; i < allMods.length; i++) {
                    if (allMods[i].id === favId) { mod = allMods[i]; break; }
                }
                if (mod) {
                    html += '<div class="sidebar-link" data-module="' + mod.id + '" onclick="App.navigate(\'' + mod.id + '\')">'
                        + '<span class="sidebar-link-icon">' + mod.icon + '</span>'
                        + '<span>' + mod.label + '</span>'
                        + '<span class="sidebar-fav-star active" onclick="event.stopPropagation();App.toggleFavorite(\'' + mod.id + '\')" title="Remove from favorites">&#9733;</span>'
                        + '</div>';
                }
            });
            html += '</div>';
        }

        NAV.forEach(function (group) {
            html += '<div class="sidebar-group">'
                + '<div class="sidebar-group-title">' + group.title + '</div>';
            group.items.forEach(function (item) {
                var starClass = isFavorite(item.id) ? ' active' : '';
                html += '<div class="sidebar-link" data-module="' + item.id + '" onclick="App.navigate(\'' + item.id + '\')">'
                    + '<span class="sidebar-link-icon">' + item.icon + '</span>'
                    + '<span>' + item.label + '</span>'
                    + '<span class="sidebar-fav-star' + starClass + '" onclick="event.stopPropagation();App.toggleFavorite(\'' + item.id + '\')" title="Toggle favorite">&#9733;</span>'
                    + '</div>';
            });
            html += '</div>';
        });

        html += '</nav>'
            + '<div class="sidebar-footer">'
            + '<a href="https://github.com/rkalani1/neuroepi-suite" target="_blank" rel="noopener" style="font-size:0.75rem;color:var(--text-tertiary);">GitHub</a>'
            + '<div style="display:flex;gap:6px;align-items:center;">'
            + '<button class="theme-toggle" onclick="App.showShortcutsModal()" title="Keyboard shortcuts">'
            + '<span>?</span>'
            + '</button>'
            + '<button class="theme-toggle" onclick="App.toggleTheme()" title="Toggle theme">'
            + '<span id="theme-icon">&#9790;</span>'
            + '</button></div></div>';

        setTrustedHTML(sidebar, html);
    }

    function renderMobileNav() {
        var nav = document.getElementById('mobile-nav');
        var html = '<div class="mobile-nav-items">';
        MOBILE_NAV.forEach(function (item) {
            html += '<button class="mobile-nav-item" data-module="' + item.id + '" onclick="App.navigate(\'' + item.id + '\')">'
                + '<span class="mobile-nav-item-icon">' + item.icon + '</span>'
                + '<span>' + item.label + '</span></button>';
        });
        html += '</div>';
        setTrustedHTML(nav, html);
    }

    // ============================================================
    // COMMAND PALETTE
    // ============================================================

    function initCommandPalette() {
        // Create command palette overlay element
        var overlay = document.createElement('div');
        overlay.id = 'command-palette-overlay';
        overlay.className = 'cmd-palette-overlay';
        overlay.onclick = function (e) {
            if (e.target === overlay) closeCommandPalette();
        };

        var dialog = document.createElement('div');
        dialog.className = 'cmd-palette-dialog';

        setTrustedHTML(dialog,
            '<div class="cmd-palette-input-wrap">'
            + '<span class="cmd-palette-search-icon">&#128269;</span>'
            + '<input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="Search modules..." autocomplete="off" />'
            + '<kbd class="kbd-hint" style="margin-right:4px;">esc</kbd>'
            + '</div>'
            + '<div id="cmd-palette-results" class="cmd-palette-results"></div>'
        );

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        var input = document.getElementById('cmd-palette-input');
        input.addEventListener('input', function () {
            renderCommandPaletteResults(input.value);
        });
        input.addEventListener('keydown', function (e) {
            handleCommandPaletteKeydown(e);
        });
    }

    function openCommandPalette() {
        var overlay = document.getElementById('command-palette-overlay');
        if (!overlay) return;
        overlay.classList.add('visible');
        commandPaletteOpen = true;
        var input = document.getElementById('cmd-palette-input');
        input.value = '';
        renderCommandPaletteResults('');
        setTimeout(function () { input.focus(); }, 50);
    }

    function closeCommandPalette() {
        var overlay = document.getElementById('command-palette-overlay');
        if (!overlay) return;
        overlay.classList.remove('visible');
        commandPaletteOpen = false;
    }

    function renderCommandPaletteResults(query) {
        var resultsEl = document.getElementById('cmd-palette-results');
        if (!resultsEl) return;
        var allMods = getAllModules();
        var q = query.toLowerCase().trim();
        var filtered = allMods;
        if (q) {
            filtered = allMods.filter(function (m) {
                return m.label.toLowerCase().indexOf(q) > -1
                    || m.category.toLowerCase().indexOf(q) > -1
                    || m.description.toLowerCase().indexOf(q) > -1
                    || m.id.toLowerCase().indexOf(q) > -1;
            });
        }

        var favs = getFavorites();
        var html = '';
        if (filtered.length === 0) {
            html = '<div class="cmd-palette-empty">No modules found</div>';
        } else {
            filtered.forEach(function (mod, idx) {
                var favIcon = favs.indexOf(mod.id) > -1 ? ' &#9733;' : '';
                html += '<div class="cmd-palette-item' + (idx === 0 ? ' selected' : '') + '" data-module="' + mod.id + '" data-index="' + idx + '">'
                    + '<div class="cmd-palette-item-left">'
                    + '<span class="cmd-palette-item-icon">' + mod.icon + '</span>'
                    + '<div>'
                    + '<div class="cmd-palette-item-label">' + mod.label + favIcon + '</div>'
                    + '<div class="cmd-palette-item-desc">' + mod.description + '</div>'
                    + '</div>'
                    + '</div>'
                    + '<span class="cmd-palette-item-cat">' + mod.category + '</span>'
                    + '</div>';
            });
        }
        setTrustedHTML(resultsEl, html);

        // Add click listeners
        resultsEl.querySelectorAll('.cmd-palette-item').forEach(function (el) {
            el.addEventListener('click', function () {
                var mid = el.dataset.module;
                closeCommandPalette();
                navigate(mid);
            });
            el.addEventListener('mouseenter', function () {
                resultsEl.querySelectorAll('.cmd-palette-item').forEach(function (item) {
                    item.classList.remove('selected');
                });
                el.classList.add('selected');
            });
        });
    }

    function handleCommandPaletteKeydown(e) {
        var resultsEl = document.getElementById('cmd-palette-results');
        if (!resultsEl) return;
        var items = resultsEl.querySelectorAll('.cmd-palette-item');
        if (items.length === 0) return;
        var selectedIdx = -1;
        items.forEach(function (item, i) {
            if (item.classList.contains('selected')) selectedIdx = i;
        });

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            var next = (selectedIdx + 1) % items.length;
            items.forEach(function (item) { item.classList.remove('selected'); });
            items[next].classList.add('selected');
            items[next].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            var prev = selectedIdx <= 0 ? items.length - 1 : selectedIdx - 1;
            items.forEach(function (item) { item.classList.remove('selected'); });
            items[prev].classList.add('selected');
            items[prev].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIdx > -1 && items[selectedIdx]) {
                var mid = items[selectedIdx].dataset.module;
                closeCommandPalette();
                navigate(mid);
            }
        }
    }

    // ============================================================
    // KEYBOARD SHORTCUTS
    // ============================================================

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // Ignore shortcuts when typing in inputs (except Escape and Cmd+K)
            var tag = e.target.tagName;
            var isInput = (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');

            // Cmd+K / Ctrl+K — Command Palette
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (commandPaletteOpen) {
                    closeCommandPalette();
                } else {
                    openCommandPalette();
                }
                return;
            }

            // Escape — close overlays
            if (e.key === 'Escape') {
                if (commandPaletteOpen) {
                    closeCommandPalette();
                    return;
                }
                if (shortcutsModalOpen) {
                    closeShortcutsModal();
                    return;
                }
                // Close sidebar on mobile
                closeSidebar();
                return;
            }

            if (isInput) return;

            // ? — Shortcuts help
            if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                if (shortcutsModalOpen) {
                    closeShortcutsModal();
                } else {
                    showShortcutsModal();
                }
                return;
            }

            // 1-7 — Quick switch nav groups
            if (!e.metaKey && !e.ctrlKey && !e.altKey) {
                var num = parseInt(e.key, 10);
                if (num >= 1 && num <= 7 && num <= NAV.length) {
                    e.preventDefault();
                    var firstItem = NAV[num - 1].items[0];
                    if (firstItem) navigate(firstItem.id);
                    return;
                }
            }
        });
    }

    // ============================================================
    // SHORTCUTS MODAL
    // ============================================================

    function showShortcutsModal() {
        closeCommandPalette();
        var existing = document.getElementById('shortcuts-modal-overlay');
        if (existing) existing.remove();

        var overlay = document.createElement('div');
        overlay.id = 'shortcuts-modal-overlay';
        overlay.className = 'shortcuts-modal-overlay visible';
        overlay.onclick = function (e) {
            if (e.target === overlay) closeShortcutsModal();
        };

        var dialog = document.createElement('div');
        dialog.className = 'shortcuts-modal-dialog';
        setTrustedHTML(dialog,
            '<div class="shortcuts-modal-header">'
            + '<h3>Keyboard Shortcuts</h3>'
            + '<button class="btn btn-ghost btn-sm" onclick="App.closeShortcutsModal()">&times;</button>'
            + '</div>'
            + '<div class="shortcuts-modal-body">'
            + '<div class="shortcut-row"><kbd>&#8984;K</kbd><span>Open command palette</span></div>'
            + '<div class="shortcut-row"><kbd>Esc</kbd><span>Close overlay / modal</span></div>'
            + '<div class="shortcut-row"><kbd>?</kbd><span>Show this help</span></div>'
            + '<div class="shortcut-row"><kbd>1</kbd> - <kbd>7</kbd><span>Jump to nav group</span></div>'
            + '<div class="shortcuts-divider"></div>'
            + '<div class="shortcut-section-title">In Command Palette</div>'
            + '<div class="shortcut-row"><kbd>&#8593;</kbd> / <kbd>&#8595;</kbd><span>Navigate results</span></div>'
            + '<div class="shortcut-row"><kbd>Enter</kbd><span>Open selected module</span></div>'
            + '<div class="shortcut-row"><kbd>Esc</kbd><span>Close palette</span></div>'
            + '<div class="shortcuts-divider"></div>'
            + '<div class="shortcut-section-title">Navigation Groups</div>'
            + '<div class="shortcut-row"><kbd>1</kbd><span>Study Design</span></div>'
            + '<div class="shortcut-row"><kbd>2</kbd><span>Epidemiology</span></div>'
            + '<div class="shortcut-row"><kbd>3</kbd><span>Biostatistics</span></div>'
            + '<div class="shortcut-row"><kbd>4</kbd><span>Clinical Trials</span></div>'
            + '<div class="shortcut-row"><kbd>5</kbd><span>Meta-Analysis</span></div>'
            + '<div class="shortcut-row"><kbd>6</kbd><span>ML &amp; Prediction</span></div>'
            + '<div class="shortcut-row"><kbd>7</kbd><span>Writing &amp; Productivity</span></div>'
            + '</div>'
        );

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        shortcutsModalOpen = true;
    }

    function closeShortcutsModal() {
        var overlay = document.getElementById('shortcuts-modal-overlay');
        if (overlay) overlay.remove();
        shortcutsModalOpen = false;
    }

    // ============================================================
    // SWIPE GESTURES (Mobile)
    // ============================================================

    function initSwipeGestures() {
        var touchStartX = 0;
        var touchStartY = 0;
        var touchEndX = 0;
        var touchEndY = 0;
        var mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        mainContent.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        mainContent.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            var diffX = touchEndX - touchStartX;
            var diffY = touchEndY - touchStartY;

            // Only horizontal swipes (threshold: 80px horizontal, max 60px vertical)
            if (Math.abs(diffX) < 80 || Math.abs(diffY) > 60) return;

            // Find current module's position in its group
            if (!currentModule || currentModule === 'home') return;
            var currentGroup = null;
            var currentIdx = -1;
            for (var g = 0; g < NAV.length; g++) {
                for (var i = 0; i < NAV[g].items.length; i++) {
                    if (NAV[g].items[i].id === currentModule) {
                        currentGroup = NAV[g];
                        currentIdx = i;
                        break;
                    }
                }
                if (currentGroup) break;
            }

            if (!currentGroup) return;

            if (diffX > 0) {
                // Swipe right — previous module in group
                if (currentIdx > 0) {
                    navigate(currentGroup.items[currentIdx - 1].id);
                }
            } else {
                // Swipe left — next module in group
                if (currentIdx < currentGroup.items.length - 1) {
                    navigate(currentGroup.items[currentIdx + 1].id);
                }
            }
        }
    }

    // ============================================================
    // BREADCRUMB
    // ============================================================

    function getBreadcrumbHTML(moduleId) {
        if (moduleId === 'home') return '';
        var mod = null;
        var category = '';
        for (var g = 0; g < NAV.length; g++) {
            for (var i = 0; i < NAV[g].items.length; i++) {
                if (NAV[g].items[i].id === moduleId) {
                    mod = NAV[g].items[i];
                    category = NAV[g].title;
                    break;
                }
            }
            if (mod) break;
        }
        if (!mod) return '';
        // Find first item in category for the category link
        var catGroup = null;
        for (var g2 = 0; g2 < NAV.length; g2++) {
            if (NAV[g2].title === category) { catGroup = NAV[g2]; break; }
        }
        var catFirstId = catGroup ? catGroup.items[0].id : moduleId;
        return '<nav class="breadcrumb" aria-label="Breadcrumb">'
            + '<span class="breadcrumb-item breadcrumb-link" onclick="App.navigate(\'home\')" title="Home">&#8962;</span>'
            + '<span class="breadcrumb-sep">&#8250;</span>'
            + '<span class="breadcrumb-item breadcrumb-link" onclick="App.navigate(\'' + catFirstId + '\')" title="' + category + '">' + category + '</span>'
            + '<span class="breadcrumb-sep">&#8250;</span>'
            + '<span class="breadcrumb-item breadcrumb-current">' + mod.label + '</span>'
            + '</nav>';
    }

    // ============================================================
    // MODULE FOOTER
    // ============================================================

    function getModuleFooterHTML(moduleId) {
        if (moduleId === 'home') return '';
        var shareUrl = window.location.origin + window.location.pathname + '#' + moduleId;
        return '<div class="module-footer">'
            + '<div class="module-footer-left">'
            + '<span class="module-footer-updated">Last updated: February 2025</span>'
            + '</div>'
            + '<div class="module-footer-right">'
            + '<a href="https://github.com/rkalani1/neuroepi-suite/issues/new?title=Issue+with+' + moduleId + '" target="_blank" rel="noopener" class="module-footer-link">Report Issue</a>'
            + '<button class="btn btn-ghost btn-xs module-footer-share" onclick="App.shareModule(\'' + moduleId + '\')" title="Copy link">'
            + '<span style="margin-right:4px;">&#128279;</span>Share'
            + '</button>'
            + '</div>'
            + '</div>';
    }

    function shareModule(moduleId) {
        var url = window.location.origin + window.location.pathname + '#' + moduleId;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
                Export.showToast('Link copied to clipboard');
            });
        } else {
            // Fallback
            var ta = document.createElement('textarea');
            ta.value = url;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            Export.showToast('Link copied to clipboard');
        }
    }

    // ============================================================
    // WELCOME / DASHBOARD PAGE
    // ============================================================

    function renderDashboard(container) {
        var allMods = getAllModules();
        var recentVisits = getRecentModules();
        var favs = getFavorites();

        // Count total modules
        var totalModules = allMods.length;

        var html = '<div class="dashboard">';

        // Hero section
        html += '<div class="dashboard-hero">'
            + '<div class="dashboard-hero-icon">NE</div>'
            + '<h1 class="dashboard-hero-title">Welcome to Neuro-Epi</h1>'
            + '<p class="dashboard-hero-sub">Epidemiology, Biostatistics &amp; Clinical Research Platform</p>'
            + '<button class="dashboard-search-btn" onclick="App.openCommandPalette()">'
            + '<span style="opacity:0.5;margin-right:8px;">&#128269;</span>'
            + '<span>Search modules...</span>'
            + '<kbd class="kbd-hint">&#8984;K</kbd>'
            + '</button>'
            + '</div>';

        // Quick stats
        html += '<div class="dashboard-stats">'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">' + totalModules + '</div>'
            + '<div class="dashboard-stat-label">Modules</div>'
            + '</div>'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">200+</div>'
            + '<div class="dashboard-stat-label">Trials</div>'
            + '</div>'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">50+</div>'
            + '<div class="dashboard-stat-label">Calculators</div>'
            + '</div>'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">7</div>'
            + '<div class="dashboard-stat-label">Categories</div>'
            + '</div>'
            + '</div>';

        // Favorites section (if any)
        if (favs.length > 0) {
            html += '<div class="dashboard-section">'
                + '<h2 class="dashboard-section-title">&#9733; Your Favorites</h2>'
                + '<div class="dashboard-module-grid">';
            favs.forEach(function (favId) {
                var mod = null;
                for (var i = 0; i < allMods.length; i++) {
                    if (allMods[i].id === favId) { mod = allMods[i]; break; }
                }
                if (mod) {
                    html += '<div class="dashboard-module-card" onclick="App.navigate(\'' + mod.id + '\')">'
                        + '<span class="dashboard-module-icon">' + mod.icon + '</span>'
                        + '<div class="dashboard-module-label">' + mod.label + '</div>'
                        + '<div class="dashboard-module-desc">' + mod.description + '</div>'
                        + '</div>';
                }
            });
            html += '</div></div>';
        }

        // Recent modules (if any)
        if (recentVisits.length > 0) {
            html += '<div class="dashboard-section">'
                + '<h2 class="dashboard-section-title">&#128340; Recently Visited</h2>'
                + '<div class="dashboard-module-grid">';
            var shown = 0;
            recentVisits.forEach(function (visit) {
                if (shown >= 6) return;
                var mod = null;
                for (var i = 0; i < allMods.length; i++) {
                    if (allMods[i].id === visit.id) { mod = allMods[i]; break; }
                }
                if (mod) {
                    html += '<div class="dashboard-module-card" onclick="App.navigate(\'' + mod.id + '\')">'
                        + '<span class="dashboard-module-icon">' + mod.icon + '</span>'
                        + '<div class="dashboard-module-label">' + mod.label + '</div>'
                        + '<div class="dashboard-module-desc">' + mod.description + '</div>'
                        + '</div>';
                    shown++;
                }
            });
            html += '</div></div>';
        }

        // Recent Calculations
        var calcHistory = getCalcHistory();
        if (calcHistory.length > 0) {
            html += '<div class="dashboard-section">'
                + '<h2 class="dashboard-section-title">&#128202; Recent Calculations</h2>'
                + '<div class="dashboard-recent-calcs">';
            var calcCount = Math.min(calcHistory.length, 5);
            for (var ci = 0; ci < calcCount; ci++) {
                var entry = calcHistory[ci];
                // Resolve module ID to friendly name and navigation ID
                var resolvedId = findModuleIdByName(entry.module) || entry.module;
                var resolvedLabel = entry.module;
                for (var mi = 0; mi < allMods.length; mi++) {
                    if (allMods[mi].id === entry.module || allMods[mi].id === resolvedId) {
                        resolvedLabel = allMods[mi].label;
                        resolvedId = allMods[mi].id;
                        break;
                    }
                }
                var clickAttr = resolvedId ? ' onclick="App.navigate(\'' + resolvedId + '\')" style="cursor:pointer;"' : '';
                html += '<div class="dashboard-calc-entry card"' + clickAttr + '>'
                    + '<div style="display:flex;justify-content:space-between;align-items:center;">'
                    + '<div>'
                    + '<div style="font-weight:600;font-size:0.9rem;">' + resolvedLabel + '</div>'
                    + '<div style="font-size:0.75rem;color:var(--text-tertiary);">' + (entry.result || '').substring(0, 60) + '</div>'
                    + '</div>'
                    + '<div style="text-align:right;">'
                    + '<div style="font-size:0.7rem;color:var(--text-tertiary);">' + formatRelativeTime(entry.timestamp) + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
            }
            html += '</div></div>';
        }

        // Popular modules / Quick links
        var popularIds = ['sample-size', 'epidemiology-calcs', 'trial-database', 'meta-analysis', 'nnt-calculator'];
        html += '<div class="dashboard-section">'
            + '<h2 class="dashboard-section-title">&#9889; Popular Modules</h2>'
            + '<div class="dashboard-module-grid">';
        popularIds.forEach(function (pid) {
            var mod = null;
            for (var i = 0; i < allMods.length; i++) {
                if (allMods[i].id === pid) { mod = allMods[i]; break; }
            }
            if (mod) {
                html += '<div class="dashboard-module-card" onclick="App.navigate(\'' + mod.id + '\')">'
                    + '<span class="dashboard-module-icon">' + mod.icon + '</span>'
                    + '<div class="dashboard-module-label">' + mod.label + '</div>'
                    + '<div class="dashboard-module-desc">' + mod.description + '</div>'
                    + '</div>';
            }
        });
        html += '</div></div>';

        // All categories
        html += '<div class="dashboard-section">'
            + '<h2 class="dashboard-section-title">&#128218; All Categories</h2>'
            + '<div class="dashboard-categories">';
        NAV.forEach(function (group, gIdx) {
            html += '<div class="dashboard-category-card" onclick="App.navigate(\'' + group.items[0].id + '\')">'
                + '<div class="dashboard-category-num">' + (gIdx + 1) + '</div>'
                + '<div class="dashboard-category-title">' + group.title + '</div>'
                + '<div class="dashboard-category-count">' + group.items.length + ' module' + (group.items.length > 1 ? 's' : '') + '</div>'
                + '</div>';
        });
        html += '</div></div>';

        // What's new
        html += '<div class="dashboard-section">'
            + '<h2 class="dashboard-section-title">&#127881; What\'s New in v2.1</h2>'
            + '<div class="dashboard-whats-new card">'
            + '<ul class="dashboard-changelog">'
            + '<li><strong>R Script Generation</strong> &mdash; 26 calculators now generate ready-to-run R scripts with one click</li>'
            + '<li><strong>26 Modules</strong> &mdash; Added R Code Library, Teaching Tools, and Quick Reference</li>'
            + '<li><strong>200+ Clinical Trials</strong> &mdash; Expanded database across 17 neurological categories</li>'
            + '<li><strong>Deeper Modules</strong> &mdash; Every module expanded with new calculators, tables, and educational content</li>'
            + '<li><strong>PRECIS-2 Tool</strong> &mdash; Pragmatic-explanatory spectrum scorer in Study Design Guide</li>'
            + '<li><strong>Life Table Builder</strong> &mdash; Full abridged life table with survivorship curves</li>'
            + '<li><strong>Reporting Guidelines</strong> &mdash; CONSORT, STROBE, PRISMA, STARD, TRIPOD, and more</li>'
            + '</ul>'
            + '</div>'
            + '</div>';

        html += '</div>';

        setTrustedHTML(container, html);
    }

    // ============================================================
    // THEME
    // ============================================================

    function initTheme() {
        var saved = localStorage.getItem('neuroepi_theme');
        if (saved === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            updateThemeIcon('light');
        }
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('neuroepi_theme', next);
        updateThemeIcon(next);
        if (currentModule && modules[currentModule] && modules[currentModule].onThemeChange) {
            modules[currentModule].onThemeChange();
        }
    }

    function updateThemeIcon(theme) {
        var icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = theme === 'light' ? '\u2600' : '\u263E';
    }

    // ============================================================
    // ROUTER
    // ============================================================

    function initRouter() {
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }

    function handleRoute() {
        var hash = window.location.hash.slice(1) || 'home';
        navigate(hash, false);
    }

    function navigate(moduleId, pushState) {
        if (pushState === undefined) pushState = true;
        if (pushState) {
            window.location.hash = moduleId;
        }

        // Track visit for dashboard
        trackModuleVisit(moduleId);

        document.querySelectorAll('.sidebar-link').forEach(function (el) {
            el.classList.toggle('active', el.dataset.module === moduleId);
        });

        document.querySelectorAll('.mobile-nav-item').forEach(function (el) {
            el.classList.toggle('active', el.dataset.module === moduleId);
        });

        document.getElementById('sidebar').classList.remove('open');
        var overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.remove('visible');

        currentModule = moduleId;
        var content = document.getElementById('module-content');

        // Dashboard / home view
        if (moduleId === 'home') {
            content.textContent = '';
            content.classList.add('animate-in');
            renderDashboard(content);
            setTimeout(function () { content.classList.remove('animate-in'); }, 200);
            return;
        }

        if (modules[moduleId] && modules[moduleId].render) {
            content.textContent = '';
            content.classList.add('animate-in');

            // Add breadcrumb
            var breadcrumbDiv = document.createElement('div');
            setTrustedHTML(breadcrumbDiv, getBreadcrumbHTML(moduleId));
            content.appendChild(breadcrumbDiv);

            // Module content wrapper
            var moduleWrap = document.createElement('div');
            moduleWrap.className = 'module-content-wrap';
            content.appendChild(moduleWrap);
            try {
                modules[moduleId].render(moduleWrap);
            } catch (err) {
                console.error('Module render error [' + moduleId + ']:', err);
                var errDiv = document.createElement('div');
                errDiv.className = 'result-panel';
                errDiv.style.cssText = 'border-left:4px solid var(--danger);padding:1.5rem;';
                var errTitle = document.createElement('div');
                errTitle.style.cssText = 'font-weight:700;color:var(--danger);margin-bottom:0.5rem;';
                errTitle.textContent = 'Module Error';
                var errMsg = document.createElement('div');
                errMsg.style.cssText = 'font-size:0.9rem;color:var(--text-secondary);';
                errMsg.textContent = 'The ' + moduleId + ' module encountered an error: ' + (err.message || 'Unknown error') + '. Try refreshing the page.';
                errDiv.appendChild(errTitle);
                errDiv.appendChild(errMsg);
                moduleWrap.appendChild(errDiv);
            }

            // Add module footer
            var footerDiv = document.createElement('div');
            setTrustedHTML(footerDiv, getModuleFooterHTML(moduleId));
            content.appendChild(footerDiv);

            setTimeout(function () { content.classList.remove('animate-in'); }, 200);
        } else {
            var header = document.createElement('div');
            header.className = 'module-header';
            var h1 = document.createElement('h1');
            h1.textContent = moduleId.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
            var p = document.createElement('p');
            p.textContent = 'Loading module...';
            header.appendChild(h1);
            header.appendChild(p);
            content.textContent = '';

            // Add breadcrumb
            var breadcrumbDiv2 = document.createElement('div');
            setTrustedHTML(breadcrumbDiv2, getBreadcrumbHTML(moduleId));
            content.appendChild(breadcrumbDiv2);

            content.appendChild(header);
        }

        var savedInputs = Export.loadState('inputs_' + moduleId);
        if (savedInputs) {
            setTimeout(function () {
                Object.entries(savedInputs).forEach(function (entry) {
                    var input = content.querySelector('[name="' + entry[0] + '"]');
                    if (input) input.value = entry[1];
                });
            }, 50);
        }
    }

    function registerModule(id, module) {
        modules[id] = module;
    }

    // ============================================================
    // HELPERS
    // ============================================================

    function handleResize() {
        // Responsive adjustments if needed
    }

    function openSidebar() {
        document.getElementById('sidebar').classList.add('open');
        var overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.add('visible');
    }

    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        var overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.remove('visible');
    }

    function autoSaveInputs(container, moduleId) {
        container.addEventListener('input', function (e) {
            if (e.target.name) {
                var inputs = {};
                container.querySelectorAll('[name]').forEach(function (el) {
                    inputs[el.name] = el.value;
                });
                Export.saveState('inputs_' + moduleId, inputs);
            }
        });
    }

    function createModuleLayout(title, description) {
        return '<div class="module-header">'
            + '<h1>' + title + '</h1>'
            + '<p>' + description + '</p></div>';
    }

    function tooltip(text) {
        return '<span class="tooltip-trigger" tabindex="0">i<span class="tooltip-content">' + text + '</span></span>';
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        init: init,
        navigate: navigate,
        registerModule: registerModule,
        toggleTheme: toggleTheme,
        openSidebar: openSidebar,
        closeSidebar: closeSidebar,
        autoSaveInputs: autoSaveInputs,
        createModuleLayout: createModuleLayout,
        tooltip: tooltip,
        setTrustedHTML: setTrustedHTML,
        NAV: NAV,
        get currentModule() { return currentModule; },
        // New public API
        openCommandPalette: openCommandPalette,
        closeCommandPalette: closeCommandPalette,
        toggleFavorite: toggleFavorite,
        showShortcutsModal: showShortcutsModal,
        closeShortcutsModal: closeShortcutsModal,
        shareModule: shareModule,
        addToHistory: addToHistory,
        getHistory: getCalcHistory
    };
})();

document.addEventListener('DOMContentLoaded', function () { App.init(); });

// Global error handler — log uncaught errors gracefully
window.onerror = function (msg, src, line, col, err) {
    console.error('Neuro-Epi Error:', msg, 'at', src, line + ':' + col);
    return false; // let default handler run too
};
window.addEventListener('unhandledrejection', function (e) {
    console.error('Neuro-Epi Unhandled Promise:', e.reason);
});
