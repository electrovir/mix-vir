# mix-vir

Pseudo-mixins in Javascript.

Generated docs: https://electrovir.github.io/mix-vir/functions/defineMixin.html

## Install

```sh
npm i mix-vir
```

## Usage

Define a mixin with `defineMixin`:

<!-- example-link: src/readme-examples/no-parent-mixin.example.ts -->

```TypeScript
import {defineMixin} from 'mix-vir';

export const MyMixin = defineMixin(() => {
    return {
        myMixinMethod(): number {
            return 100;
        },
        myMixinVariable: 'value',
    };
});
```

Use a mixin (or more) for inheritance with `mixins`:

<!-- example-link: src/readme-examples/no-parent-mixins.example.ts -->

```TypeScript
import {defineMixin, mixins} from 'mix-vir';

const MyMixin = defineMixin(() => {
    return {
        myMixinMethod(): number {
            return 100;
        },
        myMixinVariable: 'value',
    };
});

export class MyClass extends mixins(MyMixin) {
    public myMethod() {
        return this.myMixinMethod();
    }
}
```

Mixins can have a required parent class by defining an input parameter:

<!-- example-link: src/readme-examples/parent-mixin.example.ts -->

```TypeScript
import {defineMixin} from 'mix-vir';

export const MyMixin = defineMixin((parent: URL) => {
    return {
        myMixinMethod() {
            return parent.origin + 'hello';
        },
    };
});
```

Which is then set with `mixinsWith` instead of `mixins`:

<!-- example-link: src/readme-examples/parent-mixins.example.ts -->

```TypeScript
import {defineMixin, mixinsWith} from 'mix-vir';

export const MyMixin = defineMixin((parent: URL) => {
    return {
        myMixinMethod() {
            return parent.origin + 'hello';
        },
    };
});

export class MyClass extends mixinsWith(URL, MyMixin) {
    public myMethod() {
        return this.myMixinMethod();
    }
}
```

Multiple mixins can be used by subsequently passing them into `mixins` or `mixinsWith`. Later mixins take precedence, meaning any clashing mixin members will be overridden.

<!-- example-link: src/readme-examples/multiple-mixins.example.ts -->

```TypeScript
import {defineMixin, mixinsWith} from 'mix-vir';

export const MyMixin1 = defineMixin((parent: URL) => {
    return {
        myMixinMethod() {
            return parent.origin + 'hello';
        },
    };
});

export const MyMixin2 = defineMixin(() => {
    return {
        myMixinMethod2() {
            return 32;
        },
    };
});

export class MyClass extends mixinsWith(URL, MyMixin1, MyMixin2) {
    public myMethod() {
        return this.myMixinMethod() + this.myMixinMethod2();
    }
}
```
