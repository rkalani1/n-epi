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
