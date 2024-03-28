import {defineMixin} from '..';

export const MyMixin = defineMixin(() => {
    return {
        myMixinMethod(): number {
            return 100;
        },
        myMixinVariable: 'value',
    };
});
