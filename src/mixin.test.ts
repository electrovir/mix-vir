import {assert} from '@open-wc/testing';
import {defineMixin} from './mixin';
import {mixinsWith} from './mixins';

describe(defineMixin.name, () => {
    const stringAddMixin = defineMixin((parent: URL) => {
        return {
            increment(value: string) {
                return value + parent.href;
            },
        };
    });
    const noParentMixin = defineMixin(() => {
        return {
            decrement(value: number) {
                return value--;
            },
        };
    });

    it('requires the correct parent class', () => {
        // @ts-expect-error: HTMLElement is not URL
        class BadChild extends mixinsWith(HTMLElement, stringAddMixin) {}

        class OkChild extends mixinsWith(HTMLElement, noParentMixin) {}
    });

    it('creates working mixins', () => {
        class GoodChild extends mixinsWith(URL, stringAddMixin, noParentMixin) {}

        const instance = new GoodChild('https://www.example.com');

        assert.strictEqual(instance.hostname, 'www.example.com');
    });
});
