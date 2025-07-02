import {myUtilityFunction, processElement} from '../src';

describe('match-media-screen', () => {
    // Clean up DOM after each test
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('myUtilityFunction', () => {
        test('should return the input parameter', () => {
            const input = 'test';
            const result = myUtilityFunction(input);
            expect(result).toBe(input);
        });

        test('should handle undefined input', () => {
            const result = myUtilityFunction();
            expect(result).toBeUndefined();
        });

        test('should handle different data types', () => {
            expect(myUtilityFunction(42)).toBe(42);
            expect(myUtilityFunction(true)).toBe(true);
            expect(myUtilityFunction(null)).toBe(null);
            expect(myUtilityFunction({})).toEqual({});
        });
    });

    describe('processElement', () => {
        test('should work with HTML elements', () => {
            const testElement = document.createElement('div');
            testElement.id = 'test-element';
            testElement.textContent = 'Test content';
            document.body.appendChild(testElement);

            const result = processElement(testElement);

            expect(result).toBe(testElement);
            expect(testElement.textContent).toBe('Test content');
        });

        test('should handle DOM manipulation', () => {
            const container = document.createElement('div');
            const child1 = document.createElement('span');
            const child2 = document.createElement('span');

            child1.textContent = 'Child 1';
            child2.textContent = 'Child 2';

            container.appendChild(child1);
            container.appendChild(child2);
            document.body.appendChild(container);

            // Test DOM queries
            const children = container.querySelectorAll('span');
            expect(children.length).toBe(2);
            expect(children[0].textContent).toBe('Child 1');
            expect(children[1].textContent).toBe('Child 2');
        });

        test('should handle events', () => {
            const button = document.createElement('button');
            button.textContent = 'Click me';
            document.body.appendChild(button);

            const mockCallback = jest.fn();
            button.addEventListener('click', mockCallback);

            // Simulate click
            button.click();

            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        test('should work with CSS styles', () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            // Test style manipulation
            element.style.width = '100px';
            element.style.height = '50px';
            element.style.backgroundColor = 'red';

            expect(element.style.width).toBe('100px');
            expect(element.style.height).toBe('50px');
            expect(element.style.backgroundColor).toBe('red');
        });
    });
});