// Mock window.matchMedia
import {MatchMediaScreen} from "../src/_index";
import {MatchMediaScreenConfig} from "../src/types/MatchMediaScreenConfig";

window.matchMedia = jest.fn().mockImplementation(query => {
    return {
        matches: false, // will always be false in this mock
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    };

});


test('constructor should initialize correctly', () => {
    const mockConfig: MatchMediaScreenConfig = {
        dev: false,
        object: {
            fontSize: 14,
            responsive: [
                {breakpoint: 480, settings: {fontSize: 12}},
                {breakpoint: 720, settings: {fontSize: 16}}
            ]
        }
    };

    const instance = new MatchMediaScreen(mockConfig);

    // Assert `currentObject` state is set correctly
    expect(instance.currentObject)
        .toEqual({
            type: 'default',
            lastBreakpoint: undefined,
            breakpoint: -1,
            object: {
                fontSize: 14
            }
        });
});

test('mergeObject should correctly merge settings', () => {
    const mockConfig: MatchMediaScreenConfig = {
        dev: false,
        object: {
            fontSize: 14,
            responsive: [
                {breakpoint: 480, settings: {fontSize: 12}},
                {breakpoint: 720, settings: {fontSize: 16}}
            ]
        }
    };

    const instance = new MatchMediaScreen(mockConfig);

    const mergedObject = (instance as any).mergeObject(480, {fontSize: 20});

    // Assert `fontSize` value of mergedObject is 20 (overridden from newObject)
    expect(mergedObject.fontSize).toEqual(20);
});
