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
