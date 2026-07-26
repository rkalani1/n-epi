/**
 * @jest-environment jsdom
 */

const createDOMPurify = require('../js/core/dompurify.min.js');
const App = require('../js/app.js');

describe('post-launch app-shell interactions', () => {
    beforeAll(() => {
        global.DOMPurify = createDOMPurify(window);
        global.Export = { loadState: () => null };
        window.App = App;
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
        document.body.innerHTML = `
            <aside id="sidebar" class="sidebar" aria-hidden="true" inert></aside>
            <div id="sidebar-overlay" class="sidebar-overlay" aria-hidden="true"></div>
            <button id="mobile-menu-trigger" aria-expanded="false" aria-controls="sidebar">Menu</button>
            <main><div id="module-content"></div></main>
            <nav id="mobile-nav"></nav>
        `;
        window.location.hash = '';
        App.init();
    });

    afterAll(() => {
        delete global.DOMPurify;
        delete global.Export;
        delete window.App;
    });

    test('closed mobile sidebar is hidden and module/favorite controls are siblings', () => {
        const sidebar = document.getElementById('sidebar');
        expect(sidebar.getAttribute('aria-hidden')).toBe('true');
        expect(sidebar.hasAttribute('inert')).toBe(true);
        expect(document.getElementById('mobile-menu-trigger').getAttribute('aria-expanded')).toBe('false');

        const rows = [...sidebar.querySelectorAll('.sidebar-module-row')];
        expect(rows).toHaveLength(25);
        rows.forEach((row) => {
            expect(row.children).toHaveLength(2);
            expect(row.querySelector('button button')).toBeNull();
            expect(row.querySelector('.sidebar-fav-star').getAttribute('aria-label')).toMatch(/favorites$/);
        });
    });

    test('sidebar opens accessibly, restores focus, and categories disclose by keyboard controls', () => {
        const trigger = document.getElementById('mobile-menu-trigger');
        const sidebar = document.getElementById('sidebar');
        trigger.focus();
        App.openSidebar();

        expect(sidebar.getAttribute('aria-hidden')).toBe('false');
        expect(sidebar.hasAttribute('inert')).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');

        App.closeSidebar();
        expect(document.activeElement).toBe(trigger);
        expect(sidebar.getAttribute('aria-hidden')).toBe('true');

        const firstToggle = sidebar.querySelector('.sidebar-group-toggle');
        firstToggle.click();
        expect(firstToggle.isConnected).toBe(false);
        const rerenderedToggle = sidebar.querySelector('.sidebar-group-toggle');
        expect(rerenderedToggle.getAttribute('aria-expanded')).toBe('false');
        expect(document.getElementById(rerenderedToggle.getAttribute('aria-controls')).hidden).toBe(true);

        App.registerModule('sample-size', { render: () => {} });
        App.navigate('sample-size', false);
        const currentToggle = sidebar.querySelector('.current-group .sidebar-group-toggle');
        currentToggle.click();
        const preservedToggle = sidebar.querySelector('.current-group .sidebar-group-toggle');
        expect(preservedToggle.getAttribute('aria-expanded')).toBe('true');
        expect(document.getElementById(preservedToggle.getAttribute('aria-controls')).hidden).toBe(false);
    });

    test('sidebar traps focus and preserves favorite-button focus across rerenders', () => {
        const trigger = document.getElementById('mobile-menu-trigger');
        const sidebar = document.getElementById('sidebar');
        App.openSidebar();

        const first = sidebar.querySelector('button');
        const last = [...sidebar.querySelectorAll('button, a[href]')].at(-1);
        last.focus();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        expect(document.activeElement).toBe(first);

        first.focus();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
        expect(document.activeElement).toBe(last);

        trigger.focus();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        expect(sidebar.contains(document.activeElement)).toBe(true);
        expect(document.activeElement).toBe(sidebar.querySelector('button'));

        const star = sidebar.querySelector('[data-favorite-module="sample-size"]');
        star.focus();
        star.click();
        const replacement = document.activeElement;
        expect(replacement.classList.contains('sidebar-fav-star')).toBe(true);
        expect(replacement.dataset.favoriteModule).toBe('sample-size');
        expect(sidebar.contains(replacement)).toBe(true);

        replacement.click();
        expect(document.activeElement.classList.contains('sidebar-fav-star')).toBe(true);
        expect(document.activeElement.dataset.favoriteModule).toBe('sample-size');
        expect(sidebar.contains(document.activeElement)).toBe(true);
    });

    test('dashboard uses one deduplicated launch row and exposes Browse all 25', () => {
        App.navigate('home', false);
        const cards = [...document.querySelectorAll('[data-continue-module]')];
        const ids = cards.map((card) => card.dataset.continueModule);
        expect(ids.length).toBeGreaterThan(0);
        expect(new Set(ids).size).toBe(ids.length);
        expect(document.body.textContent).toContain('Continue or start');
        expect(document.body.textContent).not.toContain('Recently Visited');
        expect(document.body.textContent).not.toContain('Popular Modules');
        expect(document.querySelector('.dashboard-browse-all').textContent).toBe('Browse all 25');
        cards.forEach((card) => expect(card.tagName).toBe('BUTTON'));
    });

    test('module search exposes combobox/listbox state, counts, and an announced empty state', () => {
        App.openCommandPalette();
        const input = document.getElementById('cmd-palette-input');
        const results = document.getElementById('cmd-palette-results');
        const status = document.getElementById('cmd-palette-status');

        expect(input.getAttribute('role')).toBe('combobox');
        expect(input.getAttribute('aria-expanded')).toBe('true');
        expect(results.getAttribute('role')).toBe('listbox');
        expect(results.querySelectorAll('[role="option"]')).toHaveLength(25);
        expect(status.textContent).toBe('25 modules found');
        expect(input.getAttribute('aria-activedescendant')).toBe('cmd-palette-option-0');

        input.value = 'biobank cleaning';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(results.querySelectorAll('[role="option"]')).toHaveLength(1);
        expect(status.textContent).toBe('1 module found');

        input.value = 'not-a-real-module';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(results.querySelectorAll('[role="option"]')).toHaveLength(0);
        expect(results.textContent).toContain('No modules found');
        expect(status.textContent).toBe('No matching modules');
        expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    });
});
