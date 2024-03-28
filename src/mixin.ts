import type {AnyObject, Overwrite, Public, RemoveFirstTupleEntry} from '@augment-vir/common';
import type {Simplify} from 'type-fest';

/** A mixin created by `defineMixin` that can then be used in `mixins` or `mixinsFrom`. */
export type Mixin<Parent, MixinObject extends AnyObject> = Parent extends void | undefined
    ? () => MixinObject
    : (parent: Parent) => MixinObject;

/**
 * Defines a mixin. To be used with `mixins` or `mixinsFrom`. This attaches the proper type
 * parameters needed for those two functions to work properly in a type-safe manner.
 *
 * @category Main
 */
export function defineMixin<const Parent = void, const MixinObject extends AnyObject = {}>(
    mixin: Mixin<Parent, MixinObject>,
): Mixin<Parent, MixinObject> {
    return mixin;
}

/**
 * One by one overwrites each mixin with the subsequent mixins so that any clashing properties get
 * resolved.
 */
export type MixinChain<Mixins extends ReadonlyArray<Mixin<any, AnyObject>>> =
    Mixins extends readonly [any]
        ? Simplify<Public<ReturnType<Mixins[0]>>>
        : Overwrite<
              Simplify<Public<ReturnType<Mixins[0]>>>,
              MixinChain<RemoveFirstTupleEntry<Mixins>>
          >;
