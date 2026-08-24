/**
 * @jest-environment jsdom
 */

const App = require('../js/app.js');

describe('App Favorites System', () => {
    beforeEach(() => {
        // Clear mock local storage before each test
        localStorage.clear();
        jest.restoreAllMocks();
    });

    describe('getFavorites()', () => {
        it('should return empty array when localStorage is empty', () => {
            const result = App.getFavorites();
            expect(result).toEqual([]);
        });

        it('should return parsed data when valid JSON is in localStorage', () => {
            const testData = ['module1', 'module2'];
            localStorage.setItem('neuroepi_favorites', JSON.stringify(testData));

            const result = App.getFavorites();
            expect(result).toEqual(testData);
        });

        it('should return empty array and catch error when localStorage contains invalid JSON', () => {
            // Set invalid JSON in localStorage
            localStorage.setItem('neuroepi_favorites', 'invalid JSON {[');

            // Should not throw, should return []
            const result = App.getFavorites();
            expect(result).toEqual([]);
        });

        it('should return empty array when localStorage.getItem throws an error', () => {
            // Mock getItem to throw an error (simulating disabled cookies/storage)
            jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('Storage access denied');
            });

            const result = App.getFavorites();
            expect(result).toEqual([]);
        });
    });

    describe('saveFavorites()', () => {
        it('should save data to localStorage correctly', () => {
            const testData = ['module1', 'module2'];
            App.saveFavorites(testData);

            const stored = localStorage.getItem('neuroepi_favorites');
            expect(JSON.parse(stored)).toEqual(testData);
        });

        it('should handle errors silently when localStorage.setItem throws an error', () => {
            // Mock setItem to throw an error
            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('Quota exceeded');
            });

            // Should not throw
            expect(() => {
                App.saveFavorites(['module1']);
            }).not.toThrow();

            expect(setItemSpy).toHaveBeenCalled();
        });
    });
});

describe('setTrustedHTML() sanitization', () => {
    beforeAll(() => {
        // Bundled DOMPurify is a UMD factory: require() returns createDOMPurify(window).
        const createDOMPurify = require('../js/core/dompurify.min.js');
        global.DOMPurify = createDOMPurify(window);
    });
    afterAll(() => { delete global.DOMPurify; });

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
});

describe('Navigation structure counts', () => {
    // The dashboard "Categories" stat and the keyboard-shortcut range derive from
    // NAV.length; the "Modules" stat derives from the flattened item count. Lock
    // both so the displayed numbers cannot silently drift out of sync.
    it('exposes 8 nav groups and 25 unique modules', () => {
        expect(App.NAV.length).toBe(8);
        const ids = App.NAV.flatMap((g) => g.items.map((i) => i.id));
        expect(ids.length).toBe(25);
        expect(new Set(ids).size).toBe(25);
    });
});

describe('Dashboard rendering', () => {
    beforeAll(() => {
        const createDOMPurify = require('../js/core/dompurify.min.js');
        global.DOMPurify = createDOMPurify(window);
    });

    beforeEach(() => {
        jest.restoreAllMocks();
        document.body.innerHTML = '<div id="module-content"></div><div id="sidebar"></div>';
        localStorage.clear();
    });

    afterAll(() => {
        delete global.DOMPurify;
    });

    it('renders basic dashboard structure correctly', () => {
        App.navigate('home', false);
        const container = document.getElementById('module-content');
        expect(container.querySelector('.dashboard')).not.toBeNull();
        expect(container.querySelector('.dashboard-hero-title').textContent).toBe('n-epi');
        expect(container.querySelector('.dashboard-stats')).not.toBeNull();
        expect(container.querySelector('.dashboard-continue-section')).not.toBeNull();
        expect(container.querySelector('.dashboard-categories')).not.toBeNull();
        expect(container.querySelector('.dashboard-whats-new')).not.toBeNull();
    });

    it('renders favorites on dashboard when favorites exist', () => {
        App.saveFavorites(['sample-size']);
        App.navigate('home', false);
        const container = document.getElementById('module-content');
        const favHeading = Array.from(container.querySelectorAll('.dashboard-section-title'))
            .find(el => el.textContent.includes('Favorites'));
        expect(favHeading).not.toBeUndefined();
    });

    it('renders recent calculations on dashboard when calculation history exists', () => {
        App.addToHistory('Sample Size', 'n_calc', 'N = 100 per group');
        App.navigate('home', false);
        const container = document.getElementById('module-content');
        const calcHeading = Array.from(container.querySelectorAll('.dashboard-section-title'))
            .find(el => el.textContent.includes('Recent Calculations'));
        expect(calcHeading).not.toBeUndefined();
    });
});
