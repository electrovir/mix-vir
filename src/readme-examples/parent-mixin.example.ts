import {defineMixin} from '..';

export const MyMixin = defineMixin((parent: URL) => {
    return {
        myMixinMethod() {
            return parent.origin + 'hello';
        },
    };
});
