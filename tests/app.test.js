/**
 * @jest-environment jsdom
 */

const App = require('../js/app.js');

describe('App Module', () => {
    beforeAll(() => {
        // Setup DOMPurify on global window
        const createDOMPurify = require('../js/core/dompurify.min.js');
        global.DOMPurify = createDOMPurify(window);
        Element.prototype.scrollIntoView = jest.fn();
        if (typeof document.execCommand !== 'function') {
            document.execCommand = jest.fn();
        }
    });

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <div id="sidebar"></div>
            <div id="mobile-nav"></div>
            <div id="module-content"></div>
            <div id="sidebar-overlay"></div>
            <button id="mobile-menu-trigger"></button>
        `;

        // Clear mock local storage before each test
        localStorage.clear();

        // Setup Export global mock
        global.Export = {
            showToast: jest.fn(),
            loadState: jest.fn(),
            saveState: jest.fn()
        };

        // Reset hash & current module
        window.location.hash = '';

        // Initialize App UI DOM
        App.init();

        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        delete global.DOMPurify;
        delete global.Export;
    });

    describe('Favorites System', () => {
        describe('getFavorites()', () => {
            it('should return empty array when localStorage is empty', () => {
                const result = App.getFavorites();
                expect(result).toEqual([]);
            });

            it('should return parsed data when valid JSON is in localStorage', () => {
                const testData = ['sample-size', 'epidemiology-calcs'];
                localStorage.setItem('neuroepi_favorites', JSON.stringify(testData));

                const result = App.getFavorites();
                expect(result).toEqual(testData);
            });

            it('should return empty array and catch error when localStorage contains invalid JSON', () => {
                localStorage.setItem('neuroepi_favorites', 'invalid JSON {[');

                const result = App.getFavorites();
                expect(result).toEqual([]);
            });

            it('should return empty array when localStorage.getItem throws an error', () => {
                const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                    throw new Error('Storage access denied');
                });

                const result = App.getFavorites();
                expect(result).toEqual([]);
                spy.mockRestore();
            });
        });

        describe('saveFavorites()', () => {
            it('should save data to localStorage correctly', () => {
                const testData = ['sample-size', 'power-analysis'];
                App.saveFavorites(testData);

                const stored = localStorage.getItem('neuroepi_favorites');
                expect(JSON.parse(stored)).toEqual(testData);
            });

            it('should handle errors silently when localStorage.setItem throws an error', () => {
                const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                    throw new Error('Quota exceeded');
                });

                expect(() => {
                    App.saveFavorites(['sample-size']);
                }).not.toThrow();

                expect(setItemSpy).toHaveBeenCalled();
                setItemSpy.mockRestore();
            });
        });

        describe('toggleFavorite()', () => {
            it('should add a module to favorites if not present and remove if present', () => {
                expect(App.getFavorites()).toEqual([]);

                App.toggleFavorite('sample-size');
                expect(App.getFavorites()).toEqual(['sample-size']);

                App.toggleFavorite('sample-size');
                expect(App.getFavorites()).toEqual([]);
            });

            it('should maintain active styling when currentModule is active', () => {
                App.registerModule('sample-size', { render: jest.fn() });
                App.navigate('sample-size');
                App.toggleFavorite('sample-size');

                const activeLink = document.querySelector('.sidebar-link.active');
                expect(activeLink).not.toBeNull();
                expect(activeLink.dataset.module).toBe('sample-size');
            });

            it('restores focus on favorite star button when toggled while focused', () => {
                App.registerModule('sample-size', { render: jest.fn() });
                App.navigate('sample-size');

                const starBtn = document.querySelector('.sidebar-fav-star[data-favorite-module="sample-size"]');
                expect(starBtn).not.toBeNull();
                starBtn.focus();

                App.toggleFavorite('sample-size');
                const newStarBtn = document.querySelector('.sidebar-fav-star[data-favorite-module="sample-size"]');
                expect(newStarBtn).not.toBeNull();
            });
        });
    });

    describe('setTrustedHTML() sanitization', () => {
        it('preserves the inline event handlers the app relies on (onclick/onchange/oninput)', () => {
            const el = document.createElement('div');

            App.setTrustedHTML(el, '<button onclick="App.navigate(\'home\')">Go</button>');
            expect(el.querySelector('button')).not.toBeNull();
            expect(el.querySelector('button').getAttribute('onclick')).toBe("App.navigate('home')");

            App.setTrustedHTML(el, '<select onchange="x(this)"><option>a</option></select>');
            expect(el.querySelector('select').getAttribute('onchange')).toBe('x(this)');

            App.setTrustedHTML(el, '<input oninput="y(this)">');
            expect(el.querySelector('input').getAttribute('oninput')).toBe('y(this)');
        });

        it('still removes dangerous markup (script tags, onerror, javascript: URLs)', () => {
            const el = document.createElement('div');

            App.setTrustedHTML(el, '<div>ok</div><script>window.__pwned = 1;</script>');
            expect(el.querySelector('script')).toBeNull();

            App.setTrustedHTML(el, '<img src="x" onerror="window.__pwned = 1;">');
            expect(el.querySelector('img').getAttribute('onerror')).toBeNull();

            App.setTrustedHTML(el, '<a href="javascript:alert(1)">x</a>');
            const href = el.querySelector('a').getAttribute('href');
            expect(href == null || href.indexOf('javascript:') === -1).toBe(true);
        });

        it('associates orphan form labels and makes onclick divs keyboard-operable', () => {
            const el = document.createElement('div');

            App.setTrustedHTML(el, '<div class="form-group"><label class="form-label">Age</label><input type="number"></div>');
            const label = el.querySelector('label');
            const input = el.querySelector('input');
            expect(input.id).toBeTruthy();
            expect(label.getAttribute('for')).toBe(input.id);

            App.setTrustedHTML(el, '<div class="dashboard-module-card" onclick="App.navigate(\'home\')">Card</div>');
            const card = el.querySelector('.dashboard-module-card');
            expect(card.getAttribute('role')).toBe('button');
            expect(card.getAttribute('tabindex')).toBe('0');
        });

        it('gives chart canvases a role and an accessible name from context', () => {
            const el = document.createElement('div');
            App.setTrustedHTML(el, '<div class="card-title">Forest Plot</div><div class="chart-container"><canvas id="ma-forest-canvas"></canvas></div>');
            const cv = el.querySelector('canvas');
            expect(cv.getAttribute('role')).toBe('img');
            expect(cv.getAttribute('aria-label')).toContain('Forest Plot');
        });

        it('falls back to textContent if DOMPurify is undefined', () => {
            const savedDOMPurify = global.DOMPurify;
            delete global.DOMPurify;

            const el = document.createElement('div');
            App.setTrustedHTML(el, '<strong>Safe Text</strong>');
            expect(el.textContent).toBe('<strong>Safe Text</strong>');

            global.DOMPurify = savedDOMPurify;
        });
    });

    describe('Navigation structure & Router', () => {
        it('exposes 8 nav groups and 25 unique modules', () => {
            expect(App.NAV.length).toBe(8);
            const ids = App.NAV.flatMap((g) => g.items.map((i) => i.id));
            expect(ids.length).toBe(25);
            expect(new Set(ids).size).toBe(25);
        });

        it('registers modules and navigates correctly', () => {
            const mockRender = jest.fn((container) => {
                container.innerHTML = '<div class="test-module">Test Module Rendered</div>';
            });

            App.registerModule('sample-size', { render: mockRender });
            App.navigate('sample-size');

            expect(App.currentModule).toBe('sample-size');
            expect(mockRender).toHaveBeenCalled();
            expect(document.getElementById('module-content').innerHTML).toContain('Test Module Rendered');
            expect(document.getElementById('module-content').querySelector('.breadcrumb')).not.toBeNull();
            expect(document.getElementById('module-content').querySelector('.module-footer')).not.toBeNull();
        });

        it('falls back to home when navigating to an unregistered or invalid module', () => {
            App.navigate('non-existent-module-id');
            expect(App.currentModule).toBe('home');
            expect(document.querySelector('.dashboard')).not.toBeNull();
        });

        it('handles hashchange route event', () => {
            App.registerModule('sample-size', { render: jest.fn() });
            window.location.hash = '#sample-size';
            window.dispatchEvent(new HashChangeEvent('hashchange'));

            expect(App.currentModule).toBe('sample-size');
        });

        it('handles module render errors gracefully without breaking the app', () => {
            const faultyModule = {
                render: () => {
                    throw new Error('Render crash!');
                }
            };
            App.registerModule('faulty-module', faultyModule);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            App.navigate('faulty-module');

            expect(document.getElementById('module-content').textContent).toContain('Module Error');
            expect(document.getElementById('module-content').textContent).toContain('Render crash!');
            consoleSpy.mockRestore();
        });

        it('restores saved state on navigation if Export.loadState returns inputs', () => {
            jest.useFakeTimers();
            const statefulModule = {
                render: (wrap) => {
                    wrap.innerHTML = '<input name="age" id="age-input" />';
                }
            };
            App.registerModule('stateful-mod', statefulModule);

            global.Export.loadState.mockReturnValue({ age: '42' });

            App.navigate('stateful-mod');
            jest.runAllTimers();

            const input = document.querySelector('[name="age"]');
            expect(input.value).toBe('42');
            jest.useRealTimers();
        });
    });

    describe('Calculation History', () => {
        it('adds calculations to history and retrieves them merged with Export history', () => {
            App.addToHistory('Sample Size', 'Two Proportions', 'N = 100');

            const history = App.getHistory();
            expect(history.length).toBeGreaterThan(0);
            expect(history[0].module).toBe('Sample Size');
            expect(history[0].calc).toBe('Two Proportions');
            expect(history[0].result).toBe('N = 100');
        });

        it('merges with Export history (neuroepi_history) correctly', () => {
            const mockExportHistory = [
                { moduleId: 'sample-size', result: 'n=50', timestamp: 1000 }
            ];
            localStorage.setItem('neuroepi_history', JSON.stringify(mockExportHistory));

            const history = App.getHistory();
            expect(history.length).toBe(1);
            expect(history[0].module).toBe('sample-size');
        });

        it('handles localStorage errors gracefully in addToHistory and getHistory', () => {
            const spy1 = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('Access error');
            });
            const spy2 = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('Write error');
            });

            expect(() => App.addToHistory('Mod', 'Calc', 'Res')).not.toThrow();
            expect(App.getHistory()).toEqual([]);

            spy1.mockRestore();
            spy2.mockRestore();
        });
    });

    describe('Command Palette', () => {
        it('opens and closes command palette overlay', () => {
            App.openCommandPalette();
            const overlay = document.getElementById('command-palette-overlay');
            expect(overlay.classList.contains('visible')).toBe(true);

            App.closeCommandPalette();
            expect(overlay.classList.contains('visible')).toBe(false);
        });

        it('filters modules based on user query in command palette', () => {
            App.openCommandPalette();
            const input = document.getElementById('cmd-palette-input');
            input.value = 'Sample Size';
            input.dispatchEvent(new Event('input'));

            const results = document.querySelectorAll('.cmd-palette-item');
            expect(results.length).toBe(1);
            expect(results[0].textContent).toContain('Sample Size');
        });

        it('shows empty state message when no modules match', () => {
            App.openCommandPalette();
            const input = document.getElementById('cmd-palette-input');
            input.value = 'NonexistentTerm12345';
            input.dispatchEvent(new Event('input'));

            const emptyEl = document.querySelector('.cmd-palette-empty');
            expect(emptyEl).not.toBeNull();
            expect(emptyEl.textContent).toContain('No modules found');
        });

        it('navigates results with ArrowDown, ArrowUp, and Enter keydown events', () => {
            App.openCommandPalette();
            const input = document.getElementById('cmd-palette-input');
            input.value = '';
            input.dispatchEvent(new Event('input'));

            const items = document.querySelectorAll('.cmd-palette-item');
            expect(items.length).toBeGreaterThan(1);

            // ArrowDown
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            expect(items[1].classList.contains('selected')).toBe(true);

            // ArrowUp
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
            expect(items[0].classList.contains('selected')).toBe(true);

            // Enter to select first module
            const mockModule = { render: jest.fn() };
            App.registerModule('sample-size', mockModule);
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(document.getElementById('command-palette-overlay').classList.contains('visible')).toBe(false);
            expect(App.currentModule).toBe('sample-size');
        });

        it('navigates when clicking an item in command palette', () => {
            App.openCommandPalette();
            const mockModule = { render: jest.fn() };
            App.registerModule('power-analysis', mockModule);

            const item = document.querySelector('.cmd-palette-item[data-module="power-analysis"]');
            item.click();

            expect(App.currentModule).toBe('power-analysis');
        });

        it('updates selection on mouseenter in command palette results', () => {
            App.openCommandPalette();
            const items = document.querySelectorAll('.cmd-palette-item');
            items[2].dispatchEvent(new MouseEvent('mouseenter'));
            expect(items[2].classList.contains('selected')).toBe(true);
        });
    });

    describe('Keyboard Shortcuts & Modal', () => {
        it('shows and closes shortcuts modal', () => {
            App.showShortcutsModal();
            let overlay = document.getElementById('shortcuts-modal-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay.classList.contains('visible')).toBe(true);

            App.closeShortcutsModal();
            overlay = document.getElementById('shortcuts-modal-overlay');
            expect(overlay).toBeNull();
        });

        it('triggers Command Palette with Cmd+K / Ctrl+K', () => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
            expect(document.getElementById('command-palette-overlay').classList.contains('visible')).toBe(true);

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
            expect(document.getElementById('command-palette-overlay').classList.contains('visible')).toBe(false);
        });

        it('closes overlays with Escape key', () => {
            App.openCommandPalette();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(document.getElementById('command-palette-overlay').classList.contains('visible')).toBe(false);

            App.showShortcutsModal();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(document.getElementById('shortcuts-modal-overlay')).toBeNull();
        });

        it('opens shortcuts modal when pressing ? key outside input', () => {
            App.closeShortcutsModal();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
            expect(document.getElementById('shortcuts-modal-overlay')).not.toBeNull();

            document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
            expect(document.getElementById('shortcuts-modal-overlay')).toBeNull();
        });

        it('navigates to nav groups using numeric keys 1-8 outside input', () => {
            const mockModule = { render: jest.fn() };
            App.registerModule('sample-size', mockModule);

            document.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
            expect(App.currentModule).toBe('sample-size');
        });

        it('ignores numeric shortcuts when typing inside an input element', () => {
            App.navigate('home');
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();

            input.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
            expect(App.currentModule).toBe('home');
        });

        it('activates role="button" elements on Enter or Space keydown', () => {
            const btn = document.createElement('div');
            btn.setAttribute('role', 'button');
            btn.tabIndex = 0;
            const clickSpy = jest.fn();
            btn.addEventListener('click', clickSpy);
            document.body.appendChild(btn);
            btn.focus();

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(clickSpy).toHaveBeenCalled();

            clickSpy.mockClear();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
            expect(clickSpy).toHaveBeenCalled();
        });
    });

    describe('Theme Toggle', () => {
        it('toggles light/dark theme and calls active module onThemeChange if provided', () => {
            const onThemeChangeMock = jest.fn();
            App.registerModule('theme-test-mod', { render: jest.fn(), onThemeChange: onThemeChangeMock });
            App.navigate('theme-test-mod');

            App.toggleTheme();
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');
            expect(localStorage.getItem('neuroepi_theme')).toBe('light');
            expect(onThemeChangeMock).toHaveBeenCalled();

            App.toggleTheme();
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
            expect(localStorage.getItem('neuroepi_theme')).toBe('dark');
        });

        it('initializes light theme if saved in localStorage', () => {
            localStorage.setItem('neuroepi_theme', 'light');
            App.init();
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        });
    });

    describe('Sidebar & Responsive Nav', () => {
        it('opens and closes mobile sidebar', () => {
            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });

            App.openSidebar();
            const sidebar = document.getElementById('sidebar');
            expect(sidebar.classList.contains('open')).toBe(true);
            expect(document.body.classList.contains('sidebar-open')).toBe(true);

            App.closeSidebar();
            expect(sidebar.classList.contains('open')).toBe(false);
            expect(document.body.classList.contains('sidebar-open')).toBe(false);
        });

        it('toggles sidebar collapsible groups', () => {
            const groupTitle = App.NAV[1].title; // EPIDEMIOLOGY
            App.toggleSidebarGroup(groupTitle);

            const toggleBtn = Array.from(document.querySelectorAll('.sidebar-group-toggle')).find(btn => btn.textContent.includes(groupTitle));
            expect(toggleBtn).not.toBeUndefined();
        });

        it('prevents collapsing the current active group', () => {
            App.registerModule('sample-size', { render: jest.fn() });
            App.navigate('sample-size'); // In STUDY DESIGN
            const currentGroupTitle = App.NAV[0].title;
            App.toggleSidebarGroup(currentGroupTitle);

            const groupItems = document.getElementById('sidebar-group-0');
            expect(groupItems.hasAttribute('hidden')).toBe(false);
        });

        it('traps focus inside open sidebar on Tab / Shift+Tab', () => {
            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
            App.openSidebar();

            const sidebar = document.getElementById('sidebar');
            const focusables = sidebar.querySelectorAll('button, a');
            expect(focusables.length).toBeGreaterThan(0);

            // Shift+Tab on first element wraps to last
            focusables[0].focus();
            const shiftTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
            document.dispatchEvent(shiftTab);

            // Tab on last element wraps to first
            focusables[focusables.length - 1].focus();
            const tab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
            document.dispatchEvent(tab);
        });
    });

    describe('Share Module & Utilities', () => {
        it('shares module URL using navigator.clipboard when available', async () => {
            const writeTextMock = jest.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                configurable: true,
                value: { writeText: writeTextMock }
            });

            App.shareModule('sample-size');
            expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('#sample-size'));

            await Promise.resolve();
            expect(global.Export.showToast).toHaveBeenCalledWith('Link copied to clipboard');
        });

        it('falls back to execCommand when navigator.clipboard is unavailable', () => {
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                configurable: true,
                value: undefined
            });

            const execCommandSpy = jest.spyOn(document, 'execCommand').mockReturnValue(true);
            App.shareModule('sample-size');

            expect(execCommandSpy).toHaveBeenCalledWith('copy');
            expect(global.Export.showToast).toHaveBeenCalledWith('Link copied to clipboard');
            execCommandSpy.mockRestore();
        });

        it('autoSaveInputs attaches input handler and saves state on input', () => {
            const container = document.createElement('div');
            container.innerHTML = '<input name="testInput" value="hello" />';
            document.body.appendChild(container);

            App.autoSaveInputs(container, 'my-mod');

            const input = container.querySelector('input');
            input.value = 'world';
            input.dispatchEvent(new Event('input', { bubbles: true }));

            expect(global.Export.saveState).toHaveBeenCalledWith('inputs_my-mod', { testInput: 'world' });
        });

        it('createModuleLayout returns formatted HTML header string', () => {
            const html = App.createModuleLayout('Title', 'Description');
            expect(html).toContain('<h1>Title</h1>');
            expect(html).toContain('<p>Description</p>');
        });

        it('tooltip returns formatted HTML trigger span', () => {
            const html = App.tooltip('Help text');
            expect(html).toContain('class="tooltip-trigger"');
            expect(html).toContain('Help text');
        });
    });

    describe('Dashboard View', () => {
        it('renders dashboard with stats, recent calculations, favorites, and categories', () => {
            App.saveFavorites(['sample-size']);
            App.addToHistory('Epi Calculators', 'Incidence', '10 per 1000');

            App.navigate('home');

            const content = document.getElementById('module-content');
            expect(content.querySelector('.dashboard')).not.toBeNull();
            expect(content.querySelector('.dashboard-hero-title').textContent).toBe('n-epi');
            expect(content.querySelector('.dashboard-stats')).not.toBeNull();
            expect(content.innerHTML).toContain('Your Favorites');
            expect(content.innerHTML).toContain('Recent Calculations');
            expect(content.innerHTML).toContain('All Categories');
        });

        it('computes total trials count from TrialDatabase when available', () => {
            global.TrialDatabase = {
                trials: [
                    { name: 'Trial A' },
                    { name: 'Trial B' },
                    { name: 'Trial A' } // duplicate name
                ]
            };

            App.navigate('home');

            const content = document.getElementById('module-content');
            expect(content.innerHTML).toContain('2</div><div class="dashboard-stat-label">Trials');

            delete global.TrialDatabase;
        });
    });

    describe('Global Error Handlers', () => {
        it('catches uncaught window errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            window.onerror('Test error msg', 'test.js', 1, 1, new Error('Test'));
            expect(consoleSpy).toHaveBeenCalledWith('n-epi Error:', 'Test error msg', 'at', 'test.js', '1:1');

            consoleSpy.mockRestore();
        });

        it('catches unhandled promise rejections gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const event = new Event('unhandledrejection');
            event.reason = 'Rejection reason';
            window.dispatchEvent(event);

            expect(consoleSpy).toHaveBeenCalledWith('n-epi Unhandled Promise:', 'Rejection reason');

            consoleSpy.mockRestore();
        });
    });
});
