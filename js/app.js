/**
 * n-epi — App Shell
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
    let sidebarReturnFocus = null;
    let commandPaletteReturnFocus = null;
    const collapsedSidebarGroups = new Set();

    // Platform-aware shortcut hint: ⌘K on Apple devices, Ctrl+K elsewhere
    const IS_APPLE = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(
        (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || ''
    );
    const PALETTE_KEY_HTML = IS_APPLE ? '&#8984;K' : 'Ctrl+K';
    const PALETTE_KEY_TEXT = IS_APPLE ? 'Cmd+K' : 'Ctrl+K';

    // Navigation structure — all data is hardcoded/trusted
    const NAV = [
        {
            title: 'STUDY DESIGN',
            items: [
                { id: 'sample-size', label: 'Sample Size', icon: '#', description: 'Calculate required sample sizes for clinical studies' },
                { id: 'power-analysis', label: 'Power Analysis', icon: 'P', description: 'Statistical power calculations and curves' },
                { id: 'hypothesis-builder', label: 'Hypothesis Builder', icon: 'H', description: 'Formulate and structure research hypotheses' },
                { id: 'study-design-guide', label: 'Design Guide', icon: '\u2630', description: 'Interactive guide for choosing study designs' }
            ]
        },
        {
            title: 'EPIDEMIOLOGY',
            items: [
                { id: 'epidemiology-calcs', label: 'Epi Calculators', icon: '2', description: 'Incidence, prevalence, and epi measures' },
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
        let result = [];
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
            let data = localStorage.getItem('neuroepi_favorites');
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
        const activeFavorite = document.activeElement?.closest?.('.sidebar-fav-star');
        const restoreFavoriteFocus = activeFavorite?.dataset.favoriteModule === moduleId;
        const favoriteScope = restoreFavoriteFocus ? activeFavorite.dataset.favoriteScope : null;
        let favs = getFavorites();
        let idx = favs.indexOf(moduleId);
        if (idx > -1) {
            favs.splice(idx, 1);
        } else {
            favs.push(moduleId);
        }
        saveFavorites(favs);
        renderSidebar();
        if (restoreFavoriteFocus) {
            const replacement = Array.from(document.querySelectorAll('.sidebar-fav-star')).find(function (button) {
                return button.dataset.favoriteModule === moduleId
                    && button.dataset.favoriteScope === favoriteScope;
            }) || Array.from(document.querySelectorAll('.sidebar-fav-star')).find(function (button) {
                return button.dataset.favoriteModule === moduleId;
            });
            if (replacement) replacement.focus();
        }
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
            let visits = JSON.parse(localStorage.getItem('neuroepi_recent_modules') || '[]');
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

    const CALC_HISTORY_KEY = 'ne-calc-history';
    const CALC_HISTORY_MAX = 20;

    function addToHistory(moduleName, calcName, resultSummary) {
        let history = getCalcHistory();
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
            let exportData = localStorage.getItem('neuroepi_history');
            let exportHistory = exportData ? JSON.parse(exportData) : [];
            // Also read from App's own key (ne-calc-history)
            let appData = localStorage.getItem(CALC_HISTORY_KEY);
            let appHistory = appData ? JSON.parse(appData) : [];
            // Merge: normalize Export entries to dashboard format
            let merged = [];
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
        let diff = Date.now() - timestamp;
        let seconds = Math.floor(diff / 1000);
        if (seconds < 60) return 'just now';
        let minutes = Math.floor(seconds / 60);
        if (minutes < 60) return minutes + 'm ago';
        let hours = Math.floor(minutes / 60);
        if (hours < 24) return hours + 'h ago';
        let days = Math.floor(hours / 24);
        if (days < 7) return days + 'd ago';
        let weeks = Math.floor(days / 7);
        return weeks + 'w ago';
    }

    // Find module ID from display name for navigation
    function findModuleIdByName(name) {
        let allMods = getAllModules();
        let lower = name.toLowerCase();
        for (let i = 0; i < allMods.length; i++) {
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
        syncSidebarA11y();

        // Activate keyboard-focusable role="button" elements (nav links, cards)
        // on Enter/Space, mirroring their inline onclick.
        document.addEventListener('keydown', function (e) {
            if (trapSidebarFocus(e)) return;
            if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
            const el = document.activeElement;
            if (!el || el.getAttribute('role') !== 'button') return;
            const tag = el.tagName;
            if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
            e.preventDefault();
            el.click();
        });
    }

    // ============================================================
    // SAFE DOM HELPERS
    // All rendered content comes from trusted internal constants.
    // ============================================================

    // DOMPurify's default config strips ALL inline event handlers (on*),
    // which would render every module inert since the UI is wired with inline
    // onclick/onchange/oninput on trusted, app-generated markup. Allow exactly
    // those three handler attributes (the only ones the app emits) so the
    // interface works, while DOMPurify still removes <script>, javascript: URLs,
    // and dangerous handlers like onerror. User-supplied strings are escaped at
    // their interpolation points (see trial-database.js / biobank-cleaning.js).
    const TRUSTED_HTML_CONFIG = { ADD_ATTR: ['onclick', 'onchange', 'oninput'] };

    let a11yIdCounter = 0;

    // Accessibility enhancement applied to every rendered fragment: associate
    // orphan .form-label elements with their control (screen-reader names), and
    // make onclick-only div/span elements keyboard-focusable and operable.
    function enhanceAccessibility(root) {
        if (!root || !root.querySelectorAll) return;
        root.querySelectorAll('label.form-label:not([for])').forEach(function (label) {
            const group = label.closest('.form-group') || label.parentElement;
            const control = group ? group.querySelector('input, select, textarea') : null;
            if (control) {
                if (!control.id) control.id = 'ctl-a11y-' + (++a11yIdCounter);
                label.setAttribute('for', control.id);
            }
        });
        root.querySelectorAll('[onclick]').forEach(function (el) {
            const tag = el.tagName;
            if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
            if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
        });
        // Give chart canvases an accessible name (they are otherwise invisible to
        // screen readers). Derive a best-effort label from a nearby title or the id.
        root.querySelectorAll('canvas:not([aria-label])').forEach(function (cv) {
            cv.setAttribute('role', 'img');
            let label = cv.getAttribute('data-chart-title');
            if (!label) {
                const container = cv.closest('.chart-container') || cv;
                let prev = container.previousElementSibling, hops = 0;
                while (prev && hops < 4 && !/(card-title|chart-title|result-value)/.test(prev.className || '')) {
                    prev = prev.previousElementSibling; hops++;
                }
                if (prev && prev.textContent) label = prev.textContent.trim().slice(0, 80);
            }
            if (!label && cv.id) label = cv.id.replace(/[-_]/g, ' ');
            cv.setAttribute('aria-label', (label || 'Chart') + ' chart (visual)');
        });
    }

    function setTrustedHTML(element, trustedContent) {
        if (typeof DOMPurify !== 'undefined') {
            element.innerHTML = DOMPurify.sanitize(trustedContent, TRUSTED_HTML_CONFIG);
        } else {
            element.textContent = trustedContent;
        }
        enhanceAccessibility(element);
    }

    // ============================================================
    // SIDEBAR (with Favorites)
    // ============================================================

    function getCurrentGroupTitle() {
        for (let i = 0; i < NAV.length; i++) {
            if (NAV[i].items.some(function (item) { return item.id === currentModule; })) {
                return NAV[i].title;
            }
        }
        return null;
    }

    function moduleRowHTML(item, scope) {
        const favorite = isFavorite(item.id);
        const destinationCurrent = item.id === currentModule;
        const favoriteAction = favorite ? 'Remove' : 'Add';
        const favoritePreposition = favorite ? ' from favorites' : ' to favorites';
        return '<li class="sidebar-module-row">'
            + '<button type="button" class="sidebar-link' + (destinationCurrent ? ' active' : '') + '"'
            + ' data-module="' + item.id + '" onclick="App.navigate(\'' + item.id + '\')"'
            + (destinationCurrent ? ' aria-current="page"' : '') + '>'
            + '<span class="sidebar-link-icon" aria-hidden="true">' + item.icon + '</span>'
            + '<span class="sidebar-link-label">' + item.label + '</span>'
            + '</button>'
            + '<button type="button" class="sidebar-fav-star' + (favorite ? ' active' : '') + '"'
            + ' data-favorite-module="' + item.id + '" data-favorite-scope="' + scope + '"'
            + ' onclick="App.toggleFavorite(\'' + item.id + '\')"'
            + ' aria-label="' + favoriteAction + ' ' + item.label + favoritePreposition + '"'
            + ' aria-pressed="' + favorite + '" title="' + favoriteAction + ' favorite">'
            + '<span aria-hidden="true">&#9733;</span></button>'
            + '</li>';
    }

    function renderSidebar() {
        let sidebar = document.getElementById('sidebar');
        let favs = getFavorites();
        let allMods = getAllModules();
        const currentGroupTitle = getCurrentGroupTitle();

        if (currentGroupTitle) collapsedSidebarGroups.delete(currentGroupTitle);

        let html = '<div class="sidebar-header">'
            + '<button type="button" class="sidebar-logo" onclick="App.navigate(\'home\')" aria-label="n-epi home">'
            + '<span class="sidebar-logo-icon" aria-hidden="true">n</span>'
            + '<span><span class="sidebar-logo-text">n-epi</span>'
            + '<span class="sidebar-logo-version">v2.1</span></span>'
            + '</button>'
            + '<button class="sidebar-cmd-k-btn" onclick="App.openCommandPalette()" title="Search modules (' + PALETTE_KEY_TEXT + ')">'
            + '<span style="opacity:0.6;">Search all ' + getAllModules().length + ' modules</span>'
            + '<kbd class="kbd-hint">' + PALETTE_KEY_HTML + '</kbd>'
            + '</button>'
            + '</div>'
            + '<nav class="sidebar-nav" aria-label="Module categories">';

        if (favs.length > 0) {
            html += '<section class="sidebar-group sidebar-favorites-group" aria-labelledby="sidebar-favorites-title">'
                + '<h2 class="sidebar-group-title" id="sidebar-favorites-title"><span aria-hidden="true">&#9733;</span> Favorites</h2>'
                + '<ul class="sidebar-group-items sidebar-favorites-items">';
            favs.forEach(function (favId) {
                let mod = allMods.find(function (candidate) { return candidate.id === favId; });
                if (mod) html += moduleRowHTML(mod, 'favorites');
            });
            html += '</ul></section>';
        }

        NAV.forEach(function (group, groupIndex) {
            const groupId = 'sidebar-group-' + groupIndex;
            const collapsed = collapsedSidebarGroups.has(group.title);
            const containsCurrent = group.title === currentGroupTitle;
            html += '<section class="sidebar-group' + (containsCurrent ? ' current-group' : '') + '">'
                + '<h2 class="sidebar-group-heading">'
                + '<button type="button" class="sidebar-group-toggle"'
                + ' aria-expanded="' + (!collapsed) + '" aria-controls="' + groupId + '"'
                + ' onclick="App.toggleSidebarGroup(\'' + group.title.replace(/'/g, "\\'") + '\')"'
                + (containsCurrent ? ' title="Current module category remains expanded"' : '') + '>'
                + '<span>' + group.title + '</span>'
                + '<span class="sidebar-group-chevron" aria-hidden="true">⌄</span>'
                + '</button></h2>'
                + '<ul id="' + groupId + '" class="sidebar-group-items"' + (collapsed ? ' hidden' : '') + '>';
            group.items.forEach(function (item) {
                html += moduleRowHTML(item, groupId);
            });
            html += '</ul></section>';
        });

        html += '</nav>'
            + '<div class="sidebar-footer">'
            + '<a href="https://github.com/rkalani1/n-epi" target="_blank" rel="noopener" style="font-size:0.75rem;color:var(--text-tertiary);">GitHub</a>'
            + '<div style="display:flex;gap:6px;align-items:center;">'
            + '<button class="theme-toggle" onclick="App.showShortcutsModal()" title="Keyboard shortcuts" aria-label="Keyboard shortcuts">'
            + '<span>?</span>'
            + '</button>'
            + '<button class="theme-toggle" onclick="App.toggleTheme()" title="Toggle theme" aria-label="Toggle light/dark theme">'
            + '<span id="theme-icon">&#9790;</span>'
            + '</button></div></div>';

        setTrustedHTML(sidebar, html);
        syncSidebarA11y();
    }

    function toggleSidebarGroup(title) {
        if (title === getCurrentGroupTitle()) return;
        if (collapsedSidebarGroups.has(title)) {
            collapsedSidebarGroups.delete(title);
        } else {
            collapsedSidebarGroups.add(title);
        }
        renderSidebar();
        const toggle = Array.from(document.querySelectorAll('.sidebar-group-toggle')).find(function (button) {
            return button.textContent.trim().indexOf(title) === 0;
        });
        if (toggle) toggle.focus();
    }

    function renderMobileNav() {
        let nav = document.getElementById('mobile-nav');
        let html = '<div class="mobile-nav-items">';
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
        let overlay = document.createElement('div');
        overlay.id = 'command-palette-overlay';
        overlay.className = 'cmd-palette-overlay';
        overlay.onclick = function (e) {
            if (e.target === overlay) closeCommandPalette();
        };

        let dialog = document.createElement('div');
        dialog.className = 'cmd-palette-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', 'Search modules');

        setTrustedHTML(dialog,
            '<div class="cmd-palette-input-wrap">'
            + '<span class="cmd-palette-search-icon">&#128269;</span>'
            + '<input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="Search modules..." autocomplete="off"'
            + ' role="combobox" aria-label="Search modules" aria-autocomplete="list" aria-expanded="false"'
            + ' aria-controls="cmd-palette-results" aria-activedescendant="" />'
            + '<kbd class="kbd-hint" style="margin-right:4px;">esc</kbd>'
            + '</div>'
            + '<p id="cmd-palette-status" class="cmd-palette-status" role="status" aria-live="polite" aria-atomic="true"></p>'
            + '<div id="cmd-palette-results" class="cmd-palette-results" role="listbox" aria-label="Module search results"></div>'
        );

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        let input = document.getElementById('cmd-palette-input');
        input.addEventListener('input', function () {
            renderCommandPaletteResults(input.value);
        });
        input.addEventListener('keydown', function (e) {
            handleCommandPaletteKeydown(e);
        });
    }

    function openCommandPalette() {
        let overlay = document.getElementById('command-palette-overlay');
        if (!overlay) return;
        commandPaletteReturnFocus = document.activeElement;
        overlay.classList.add('visible');
        commandPaletteOpen = true;
        let input = document.getElementById('cmd-palette-input');
        input.setAttribute('aria-expanded', 'true');
        input.value = '';
        renderCommandPaletteResults('');
        setTimeout(function () { input.focus(); }, 50);
    }

    function closeCommandPalette() {
        let overlay = document.getElementById('command-palette-overlay');
        if (!overlay) return;
        overlay.classList.remove('visible');
        commandPaletteOpen = false;
        let input = document.getElementById('cmd-palette-input');
        if (input) {
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
        }
        if (commandPaletteReturnFocus && commandPaletteReturnFocus.isConnected) {
            commandPaletteReturnFocus.focus();
        }
        commandPaletteReturnFocus = null;
    }

    function renderCommandPaletteResults(query) {
        let resultsEl = document.getElementById('cmd-palette-results');
        let statusEl = document.getElementById('cmd-palette-status');
        let input = document.getElementById('cmd-palette-input');
        if (!resultsEl) return;
        let allMods = getAllModules();
        let q = query.toLowerCase().trim();
        let filtered = allMods;
        if (q) {
            filtered = allMods.filter(function (m) {
                return m.label.toLowerCase().indexOf(q) > -1
                    || m.category.toLowerCase().indexOf(q) > -1
                    || m.description.toLowerCase().indexOf(q) > -1
                    || m.id.toLowerCase().indexOf(q) > -1;
            });
        }

        let favs = getFavorites();
        let html = '';
        if (filtered.length === 0) {
            html = '<div class="cmd-palette-empty">No modules found. Try another title, category, or method.</div>';
        } else {
            filtered.forEach(function (mod, idx) {
                let favIcon = favs.indexOf(mod.id) > -1 ? ' &#9733;' : '';
                html += '<div id="cmd-palette-option-' + idx + '" role="option"'
                    + ' aria-selected="' + (idx === 0) + '"'
                    + ' class="cmd-palette-item' + (idx === 0 ? ' selected' : '') + '"'
                    + ' data-module="' + mod.id + '" data-index="' + idx + '">'
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
        if (statusEl) {
            statusEl.textContent = filtered.length === 0
                ? 'No matching modules'
                : filtered.length + ' module' + (filtered.length === 1 ? '' : 's') + ' found';
        }
        if (input) {
            if (filtered.length > 0) {
                input.setAttribute('aria-activedescendant', 'cmd-palette-option-0');
            } else {
                input.removeAttribute('aria-activedescendant');
            }
        }

        // Add click listeners
        resultsEl.querySelectorAll('.cmd-palette-item').forEach(function (el) {
            el.addEventListener('click', function () {
                let mid = el.dataset.module;
                closeCommandPalette();
                navigate(mid);
            });
            el.addEventListener('mouseenter', function () {
                setCommandPaletteSelection(resultsEl.querySelectorAll('.cmd-palette-item'), Number(el.dataset.index));
            });
        });
    }

    function setCommandPaletteSelection(items, index) {
        let input = document.getElementById('cmd-palette-input');
        items.forEach(function (item, itemIndex) {
            const selected = itemIndex === index;
            item.classList.toggle('selected', selected);
            item.setAttribute('aria-selected', String(selected));
        });
        if (input && items[index]) {
            input.setAttribute('aria-activedescendant', items[index].id);
        }
    }

    function handleCommandPaletteKeydown(e) {
        let resultsEl = document.getElementById('cmd-palette-results');
        if (!resultsEl) return;
        let items = resultsEl.querySelectorAll('.cmd-palette-item');
        if (items.length === 0) return;
        let selectedIdx = -1;
        items.forEach(function (item, i) {
            if (item.classList.contains('selected')) selectedIdx = i;
        });

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            let next = (selectedIdx + 1) % items.length;
            setCommandPaletteSelection(items, next);
            items[next].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            let prev = selectedIdx <= 0 ? items.length - 1 : selectedIdx - 1;
            setCommandPaletteSelection(items, prev);
            items[prev].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIdx > -1 && items[selectedIdx]) {
                let mid = items[selectedIdx].dataset.module;
                closeCommandPalette();
                navigate(mid);
            }
        }
    }

    // ============================================================
    // KEYBOARD SHORTCUTS
    // ============================================================

    function handleGlobalKeydown(e) {
        // Ignore shortcuts when typing in inputs (except Escape and Cmd+K)
        let tag = e.target.tagName;
        let isInput = (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');

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

        // 1..NAV.length — Quick switch nav groups
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            let num = parseInt(e.key, 10);
            if (num >= 1 && num <= NAV.length) {
                e.preventDefault();
                let firstItem = NAV[num - 1].items[0];
                if (firstItem) navigate(firstItem.id);
                return;
            }
        }
    }

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', handleGlobalKeydown);
    }

    // ============================================================
    // SHORTCUTS MODAL
    // ============================================================

    function getShortcutsHTML() {
        return '<div class="shortcuts-modal-header">'
            + '<h3>Keyboard Shortcuts</h3>'
            + '<button class="btn btn-ghost btn-sm" onclick="App.closeShortcutsModal()">&times;</button>'
            + '</div>'
            + '<div class="shortcuts-modal-body">'
            + '<div class="shortcut-row"><kbd>' + PALETTE_KEY_HTML + '</kbd><span>Open command palette</span></div>'
            + '<div class="shortcut-row"><kbd>Esc</kbd><span>Close overlay / modal</span></div>'
            + '<div class="shortcut-row"><kbd>?</kbd><span>Show this help</span></div>'
            + '<div class="shortcut-row"><kbd>1</kbd> - <kbd>' + NAV.length + '</kbd><span>Jump to nav group</span></div>'
            + '<div class="shortcuts-divider"></div>'
            + '<div class="shortcut-section-title">In Command Palette</div>'
            + '<div class="shortcut-row"><kbd>&#8593;</kbd> / <kbd>&#8595;</kbd><span>Navigate results</span></div>'
            + '<div class="shortcut-row"><kbd>Enter</kbd><span>Open selected module</span></div>'
            + '<div class="shortcut-row"><kbd>Esc</kbd><span>Close palette</span></div>'
            + '<div class="shortcuts-divider"></div>'
            + '<div class="shortcut-section-title">Navigation Groups</div>'
            + NAV.map(function (g, i) {
                return '<div class="shortcut-row"><kbd>' + (i + 1) + '</kbd><span>' + g.title + '</span></div>';
            }).join('')
            + '</div>';
    }

    function showShortcutsModal() {
        closeCommandPalette();
        let existing = document.getElementById('shortcuts-modal-overlay');
        if (existing) existing.remove();

        let overlay = document.createElement('div');
        overlay.id = 'shortcuts-modal-overlay';
        overlay.className = 'shortcuts-modal-overlay visible';
        overlay.onclick = function (e) {
            if (e.target === overlay) closeShortcutsModal();
        };

        let dialog = document.createElement('div');
        dialog.className = 'shortcuts-modal-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', 'Keyboard shortcuts');
        setTrustedHTML(dialog, getShortcutsHTML());

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        shortcutsModalOpen = true;
    }

    function closeShortcutsModal() {
        let overlay = document.getElementById('shortcuts-modal-overlay');
        if (overlay) overlay.remove();
        shortcutsModalOpen = false;
    }

    // ============================================================
    // SWIPE GESTURES (Mobile)
    // ============================================================

    function initSwipeGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let mainContent = document.querySelector('.main-content');
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
            let diffX = touchEndX - touchStartX;
            let diffY = touchEndY - touchStartY;

            // Only horizontal swipes (threshold: 80px horizontal, max 60px vertical)
            if (Math.abs(diffX) < 80 || Math.abs(diffY) > 60) return;

            // Find current module's position in its group
            if (!currentModule || currentModule === 'home') return;
            let currentGroup = null;
            let currentIdx = -1;
            for (let g = 0; g < NAV.length; g++) {
                for (let i = 0; i < NAV[g].items.length; i++) {
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
                return;
            }

            // Swipe left — next module in group
            if (currentIdx < currentGroup.items.length - 1) {
                navigate(currentGroup.items[currentIdx + 1].id);
            }
        }
    }

    // ============================================================
    // BREADCRUMB
    // ============================================================

    function getBreadcrumbHTML(moduleId) {
        if (moduleId === 'home') return '';
        let mod = null;
        let category = '';
        for (let g = 0; g < NAV.length; g++) {
            for (let i = 0; i < NAV[g].items.length; i++) {
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
        let catGroup = null;
        for (let g2 = 0; g2 < NAV.length; g2++) {
            if (NAV[g2].title === category) { catGroup = NAV[g2]; break; }
        }
        let catFirstId = catGroup ? catGroup.items[0].id : moduleId;
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
        let shareUrl = window.location.origin + window.location.pathname + '#' + moduleId;
        return '<div class="module-footer">'
            + '<div class="module-footer-left">'
            + '<span class="module-footer-updated">Public synthetic/reference demo &mdash; not for clinical decisions</span>'
            + '</div>'
            + '<div class="module-footer-right">'
            + '<a href="https://github.com/rkalani1/n-epi/issues/new?title=Issue+with+' + moduleId + '" target="_blank" rel="noopener" class="module-footer-link">Report Issue</a>'
            + '<button class="btn btn-ghost btn-xs module-footer-share" onclick="App.shareModule(\'' + moduleId + '\')" title="Copy link">'
            + '<span style="margin-right:4px;">&#128279;</span>Share'
            + '</button>'
            + '</div>'
            + '</div>';
    }

    function shareModule(moduleId) {
        let url = window.location.origin + window.location.pathname + '#' + moduleId;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
                Export.showToast('Link copied to clipboard');
            });
        } else {
            // Fallback
            let ta = document.createElement('textarea');
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

    function renderDashboardHeroHTML() {
        return '<div class="dashboard-hero">'
            + '<h1 class="dashboard-hero-title">n-epi</h1>'
            + '<button class="dashboard-search-btn" onclick="App.openCommandPalette()">'
            + '<span style="opacity:0.5;margin-right:8px;">&#128269;</span>'
            + '<span>Search modules...</span>'
            + '<kbd class="kbd-hint">' + PALETTE_KEY_HTML + '</kbd>'
            + '</button>'
            + '</div>';
    }

    function renderDashboardStatsHTML(totalModules) {
        var totalTrials = (typeof TrialDatabase !== 'undefined' && TrialDatabase.trials)
            ? (function () {
                var names = {};
                TrialDatabase.trials.forEach(function (t) { names[t.name] = true; });
                return Object.keys(names).length;
            })()
            : 0;
        return '<div class="dashboard-stats">'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">' + totalModules + '</div>'
            + '<div class="dashboard-stat-label">Modules</div>'
            + '</div>'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">' + totalTrials + '</div>'
            + '<div class="dashboard-stat-label">Trials</div>'
            + '</div>'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">50+</div>'
            + '<div class="dashboard-stat-label">Calculators</div>'
            + '</div>'
            + '<div class="dashboard-stat">'
            + '<div class="dashboard-stat-value">' + NAV.length + '</div>'
            + '<div class="dashboard-stat-label">Categories</div>'
            + '</div>'
            + '</div>';
    }

    function renderDashboardFavoritesHTML(favs, allMods) {
        if (favs.length === 0) return '';
        let html = '<div class="dashboard-section">'
            + '<h2 class="dashboard-section-title">&#9733; Your Favorites</h2>'
            + '<div class="dashboard-module-grid">';
        favs.forEach(function (favId) {
            let mod = null;
            for (let i = 0; i < allMods.length; i++) {
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
        return html;
    }

    function renderDashboardContinueHTML(recentVisits, allMods, totalModules) {
        let popularIds = ['sample-size', 'epidemiology-calcs', 'trial-database', 'meta-analysis', 'nnt-calculator'];
        let continueIds = [];
        recentVisits.forEach(function (visit) {
            if (continueIds.length < 6 && !continueIds.includes(visit.id)) continueIds.push(visit.id);
        });
        popularIds.forEach(function (moduleId) {
            if (continueIds.length < 6 && !continueIds.includes(moduleId)) continueIds.push(moduleId);
        });

        let html = '<div class="dashboard-section dashboard-continue-section">'
            + '<div class="dashboard-section-heading">'
            + '<h2 class="dashboard-section-title">&#8594; Continue or start</h2>'
            + '<button type="button" class="dashboard-browse-all" onclick="App.openCommandPalette()">Browse all ' + totalModules + '</button>'
            + '</div>'
            + '<div class="dashboard-module-grid">';
        continueIds.forEach(function (moduleId) {
            let mod = allMods.find(function (candidate) { return candidate.id === moduleId; });
            if (mod) {
                html += '<button type="button" class="dashboard-module-card" data-continue-module="' + mod.id + '" onclick="App.navigate(\'' + mod.id + '\')">'
                    + '<span class="dashboard-module-icon">' + mod.icon + '</span>'
                    + '<div class="dashboard-module-label">' + mod.label + '</div>'
                    + '<div class="dashboard-module-desc">' + mod.description + '</div>'
                    + '</button>';
            }
        });
        html += '</div></div>';
        return html;
    }

    function renderDashboardRecentCalcsHTML(allMods) {
        let calcHistory = getCalcHistory();
        if (calcHistory.length === 0) return '';
        let html = '<div class="dashboard-section">'
            + '<h2 class="dashboard-section-title">&#128202; Recent Calculations</h2>'
            + '<div class="dashboard-recent-calcs">';
        let calcCount = Math.min(calcHistory.length, 5);
        for (let ci = 0; ci < calcCount; ci++) {
            let entry = calcHistory[ci];
            let resolvedId = findModuleIdByName(entry.module) || entry.module;
            let resolvedLabel = entry.module;
            for (let mi = 0; mi < allMods.length; mi++) {
                if (allMods[mi].id === entry.module || allMods[mi].id === resolvedId) {
                    resolvedLabel = allMods[mi].label;
                    resolvedId = allMods[mi].id;
                    break;
                }
            }
            let clickAttr = resolvedId ? ' onclick="App.navigate(\'' + resolvedId + '\')" style="cursor:pointer;"' : '';
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
        return html;
    }

    function renderDashboardCategoriesHTML() {
        let html = '<div class="dashboard-section">'
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
        return html;
    }

    function renderDashboardWhatsNewHTML(totalModules) {
        return '<div class="dashboard-section">'
            + '<h2 class="dashboard-section-title">&#127881; What\'s New in v2.1</h2>'
            + '<div class="dashboard-whats-new card">'
            + '<ul class="dashboard-changelog">'
            + '<li><strong>R Script Generation</strong> &mdash; calculators across the suite generate ready-to-run R scripts with one click</li>'
            + '<li><strong>' + totalModules + ' Modules</strong> &mdash; Added R Code Library, Teaching Tools, Quick Reference, and Biobank Cleaning</li>'
            + '<li><strong>Clinical Trial Database</strong> &mdash; Expanded across 21 neurological categories, with all citations verified against PubMed</li>'
            + '<li><strong>Deeper Modules</strong> &mdash; Every module expanded with new calculators, tables, and educational content</li>'
            + '<li><strong>PRECIS-2 Tool</strong> &mdash; Pragmatic-explanatory spectrum scorer in Study Design Guide</li>'
            + '<li><strong>Life Table Builder</strong> &mdash; Full abridged life table with survivorship curves</li>'
            + '<li><strong>Reporting Guidelines</strong> &mdash; CONSORT, STROBE, PRISMA, STARD, TRIPOD, and more</li>'
            + '</ul>'
            + '</div>'
            + '</div>';
    }

    function renderDashboard(container) {
        let allMods = getAllModules();
        let recentVisits = getRecentModules();
        let favs = getFavorites();
        let totalModules = allMods.length;

        let html = '<div class="dashboard">'
            + renderDashboardHeroHTML()
            + renderDashboardStatsHTML(totalModules)
            + renderDashboardFavoritesHTML(favs, allMods)
            + renderDashboardContinueHTML(recentVisits, allMods, totalModules)
            + renderDashboardRecentCalcsHTML(allMods)
            + renderDashboardCategoriesHTML()
            + renderDashboardWhatsNewHTML(totalModules)
            + '</div>';

        setTrustedHTML(container, html);
    }

    // ============================================================
    // THEME
    // ============================================================

    function initTheme() {
        let saved = localStorage.getItem('neuroepi_theme');
        if (saved === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            updateThemeIcon('light');
        }
    }

    function toggleTheme() {
        let current = document.documentElement.getAttribute('data-theme');
        let next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('neuroepi_theme', next);
        updateThemeIcon(next);
        if (currentModule && modules[currentModule] && modules[currentModule].onThemeChange) {
            modules[currentModule].onThemeChange();
        }
    }

    function updateThemeIcon(theme) {
        let icon = document.getElementById('theme-icon');
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
        let hash = window.location.hash.slice(1) || 'home';
        navigate(hash, false);
    }

    function navigate(moduleId, pushState) {
        if (pushState === undefined) pushState = true;

        // Unknown route: fall back to home instead of stranding the user on a
        // permanent "Loading module..." stub. All real modules register at load,
        // so anything unregistered (and not 'home') is a stray hash.
        if (moduleId !== 'home' && (!modules[moduleId] || !modules[moduleId].render)) {
            navigate('home', true);
            return;
        }

        if (pushState) {
            window.location.hash = moduleId;
        }

        // Track visit for dashboard
        trackModuleVisit(moduleId);

        currentModule = moduleId;
        const currentGroupTitle = getCurrentGroupTitle();
        if (currentGroupTitle) collapsedSidebarGroups.delete(currentGroupTitle);
        renderSidebar();

        document.querySelectorAll('.mobile-nav-item').forEach(function (el) {
            el.classList.toggle('active', el.dataset.module === moduleId);
        });

        closeSidebar(false);
        let content = document.getElementById('module-content');

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
            let breadcrumbDiv = document.createElement('div');
            setTrustedHTML(breadcrumbDiv, getBreadcrumbHTML(moduleId));
            content.appendChild(breadcrumbDiv);

            // Module content wrapper
            let moduleWrap = document.createElement('div');
            moduleWrap.className = 'module-content-wrap';
            content.appendChild(moduleWrap);
            try {
                modules[moduleId].render(moduleWrap);
            } catch (err) {
                console.error('Module render error [' + moduleId + ']:', err);
                let errDiv = document.createElement('div');
                errDiv.className = 'result-panel';
                errDiv.style.cssText = 'border-left:4px solid var(--danger);padding:1.5rem;';
                let errTitle = document.createElement('div');
                errTitle.style.cssText = 'font-weight:700;color:var(--danger);margin-bottom:0.5rem;';
                errTitle.textContent = 'Module Error';
                let errMsg = document.createElement('div');
                errMsg.style.cssText = 'font-size:0.9rem;color:var(--text-secondary);';
                errMsg.textContent = 'The ' + moduleId + ' module encountered an error: ' + (err.message || 'Unknown error') + '. Try refreshing the page.';
                errDiv.appendChild(errTitle);
                errDiv.appendChild(errMsg);
                moduleWrap.appendChild(errDiv);
            }

            // Add module footer
            let footerDiv = document.createElement('div');
            setTrustedHTML(footerDiv, getModuleFooterHTML(moduleId));
            content.appendChild(footerDiv);

            setTimeout(function () { content.classList.remove('animate-in'); }, 200);
        } else {
            let header = document.createElement('div');
            header.className = 'module-header';
            let h1 = document.createElement('h1');
            h1.textContent = moduleId.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
            let p = document.createElement('p');
            p.textContent = 'Loading module...';
            header.appendChild(h1);
            header.appendChild(p);
            content.textContent = '';

            // Add breadcrumb
            let breadcrumbDiv2 = document.createElement('div');
            setTrustedHTML(breadcrumbDiv2, getBreadcrumbHTML(moduleId));
            content.appendChild(breadcrumbDiv2);

            content.appendChild(header);
        }

        let savedInputs = Export.loadState('inputs_' + moduleId);
        if (savedInputs) {
            setTimeout(function () {
                Object.entries(savedInputs).forEach(function (entry) {
                    let input = content.querySelector('[name="' + entry[0] + '"]');
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
        if (window.innerWidth >= 1024) closeSidebar(false);
        syncSidebarA11y();
    }

    function openSidebar() {
        if (window.innerWidth >= 1024) return;
        const sidebar = document.getElementById('sidebar');
        const trigger = document.getElementById('mobile-menu-trigger');
        sidebarReturnFocus = document.activeElement;
        sidebar.removeAttribute('inert');
        sidebar.setAttribute('aria-hidden', 'false');
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        let overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.add('visible');
        setTimeout(function () {
            const first = sidebar.querySelector('button:not([disabled]), a[href]');
            if (first) first.focus();
        }, 0);
    }

    function closeSidebar(restoreFocus) {
        if (restoreFocus === undefined) restoreFocus = true;
        const sidebar = document.getElementById('sidebar');
        const wasOpen = sidebar.classList.contains('open');
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        const trigger = document.getElementById('mobile-menu-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        let overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.remove('visible');
        syncSidebarA11y();
        if (wasOpen && restoreFocus && sidebarReturnFocus && sidebarReturnFocus.isConnected) {
            sidebarReturnFocus.focus();
        }
        sidebarReturnFocus = null;
    }

    function syncSidebarA11y() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        const compact = window.innerWidth < 1024;
        const open = sidebar.classList.contains('open');
        if (compact && !open) {
            sidebar.setAttribute('inert', '');
            sidebar.setAttribute('aria-hidden', 'true');
        } else {
            sidebar.removeAttribute('inert');
            sidebar.setAttribute('aria-hidden', 'false');
        }
    }

    function trapSidebarFocus(event) {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar || !sidebar.classList.contains('open') || event.key !== 'Tab') return false;
        const focusable = Array.from(sidebar.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(function (element) {
            return !element.closest('[hidden]');
        });
        if (focusable.length === 0) {
            event.preventDefault();
            sidebar.focus();
            return true;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!sidebar.contains(document.activeElement)) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
            return true;
        }
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
            return true;
        }
        if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
            return true;
        }
        return false;
    }

    function autoSaveInputs(container, moduleId) {
        container.addEventListener('input', function (e) {
            if (e.target.name) {
                let inputs = {};
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
        getFavorites: getFavorites,
        saveFavorites: saveFavorites,
        init: init,
        navigate: navigate,
        registerModule: registerModule,
        toggleTheme: toggleTheme,
        openSidebar: openSidebar,
        closeSidebar: closeSidebar,
        toggleSidebarGroup: toggleSidebarGroup,
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
    console.error('n-epi Error:', msg, 'at', src, line + ':' + col);
    return false; // let default handler run too
};
window.addEventListener('unhandledrejection', function (e) {
    console.error('n-epi Unhandled Promise:', e.reason);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
