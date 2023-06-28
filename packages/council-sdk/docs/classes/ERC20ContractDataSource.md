[@council/sdk](../README.md) / [Exports](../modules.md) / ERC20ContractDataSource

# Class: ERC20ContractDataSource

## Hierarchy

- [`ContractDataSource`](ContractDataSource.md)<`MockERC20`\>

  ↳ **`ERC20ContractDataSource`**

## Implements

- [`TokenDataSource`](../interfaces/TokenDataSource.md)

## Table of contents

### Constructors

- [constructor](ERC20ContractDataSource.md#constructor)

### Properties

- [address](ERC20ContractDataSource.md#address)
- [cache](ERC20ContractDataSource.md#cache)
- [context](ERC20ContractDataSource.md#context)
- [contract](ERC20ContractDataSource.md#contract)

### Methods

- [approve](ERC20ContractDataSource.md#approve)
- [cached](ERC20ContractDataSource.md#cached)
- [call](ERC20ContractDataSource.md#call)
- [callStatic](ERC20ContractDataSource.md#callstatic)
- [callWithSigner](ERC20ContractDataSource.md#callwithsigner)
- [clearCached](ERC20ContractDataSource.md#clearcached)
- [deleteCached](ERC20ContractDataSource.md#deletecached)
- [deleteCall](ERC20ContractDataSource.md#deletecall)
- [getAllowance](ERC20ContractDataSource.md#getallowance)
- [getBalanceOf](ERC20ContractDataSource.md#getbalanceof)
- [getDecimals](ERC20ContractDataSource.md#getdecimals)
- [getEvents](ERC20ContractDataSource.md#getevents)
- [getName](ERC20ContractDataSource.md#getname)
- [getSymbol](ERC20ContractDataSource.md#getsymbol)

## Constructors

### constructor

• **new ERC20ContractDataSource**(`address`, `context`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `context` | [`CouncilContext`](CouncilContext.md) |

#### Overrides

[ContractDataSource](ContractDataSource.md).[constructor](ContractDataSource.md#constructor)

#### Defined in

[packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts:18](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts#L18)

## Properties

### address

• **address**: `string`

#### Implementation of

[TokenDataSource](../interfaces/TokenDataSource.md).[address](../interfaces/TokenDataSource.md#address)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[address](ContractDataSource.md#address)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:22](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L22)

___

### cache

• **cache**: `LRUCache`<`string`, `any`\>

#### Inherited from

[ContractDataSource](ContractDataSource.md).[cache](ContractDataSource.md#cache)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:13](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L13)

___

### context

• **context**: [`CouncilContext`](CouncilContext.md)

#### Implementation of

[TokenDataSource](../interfaces/TokenDataSource.md).[context](../interfaces/TokenDataSource.md#context)

#### Inherited from

[ContractDataSource](ContractDataSource.md).[context](ContractDataSource.md#context)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:12](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L12)

___

### contract

• **contract**: `MockERC20`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[contract](ContractDataSource.md#contract)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:23](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L23)

## Methods

### approve

▸ **approve**(`signer`, `spender`, `amount`, `options?`): `Promise`<`string`\>

Sets approval of token access up to a certain amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Signer. |
| `spender` | `string` | Address to approve access to. |
| `amount` | `BigNumber` | Amount approved for, defaults to maximum. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`string`\>

- The transaction hash.

#### Implementation of

TokenDataSource.approve

#### Defined in

[packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts:71](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts#L71)

___

### cached

▸ **cached**<`T`, `TKey`\>(`cacheKey`, `callback`): `ReturnType`<`T`\>

Cache the result of a callback using a given key.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends (...`args`: `any`) => `any` |
| `TKey` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheKey` | `TKey` | The key to use for the cache entry. The key will be reduced to a string. |
| `callback` | `T` | The function to be cached. The return type of the `cached` method will match the return type of this function. |

#### Returns

`ReturnType`<`T`\>

The cached result of the callback function.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[cached](ContractDataSource.md#cached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:28](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L28)

___

### call

▸ **call**<`K`\>(`method`, `args`): `MockERC20`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

Call a method on the contract and cache the result with a key made from the
method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"symbol"`` \| ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"DOMAIN_SEPARATOR()"`` \| ``"PERMIT_TYPEHASH()"`` \| ``"allowance(address,address)"`` \| ``"approve(address,uint256)"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"balanceOf(address)"`` \| ``"burn(address,uint256)"`` \| ``"deauthorize(address)"`` \| ``"decimals()"`` \| ``"isAuthorized(address)"`` \| ``"mint(address,uint256)"`` \| ``"name()"`` \| ``"nonces(address)"`` \| ``"owner()"`` \| ``"permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"`` \| ``"setAllowance(address,address,uint256)"`` \| ``"setBalance(address,uint256)"`` \| ``"setOwner(address)"`` \| ``"symbol()"`` \| ``"totalSupply()"`` \| ``"transfer(address,uint256)"`` \| ``"transferFrom(address,address,uint256)"`` \| ``"DOMAIN_SEPARATOR"`` \| ``"PERMIT_TYPEHASH"`` \| ``"allowance"`` \| ``"approve"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"balanceOf"`` \| ``"burn"`` \| ``"deauthorize"`` \| ``"decimals"`` \| ``"isAuthorized"`` \| ``"mint"`` \| ``"name"`` \| ``"nonces"`` \| ``"owner"`` \| ``"permit"`` \| ``"setAllowance"`` \| ``"setBalance"`` \| ``"setOwner"`` \| ``"totalSupply"`` \| ``"transfer"`` \| ``"transferFrom"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | `MockERC20`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`MockERC20`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `ReturnType`<`any`[`any`]\> : `never`

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[call](ContractDataSource.md#call)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:43](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L43)

___

### callStatic

▸ **callStatic**<`K`\>(`method`, `args`): `ReturnType`<{ `DOMAIN_SEPARATOR`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `DOMAIN_SEPARATOR()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `PERMIT_TYPEHASH`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `PERMIT_TYPEHASH()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `allowance`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `allowance(address,address)`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `approve`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `approve(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `balanceOf`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `balanceOf(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `burn`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `burn(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `decimals`: (`overrides?`: `CallOverrides`) => `Promise`<`number`\> ; `decimals()`: (`overrides?`: `CallOverrides`) => `Promise`<`number`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `mint`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `mint(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `name`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `name()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `nonces`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `nonces(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `permit`: (`owner`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `deadline`: `PromiseOrValue`<`BigNumberish`\>, `v`: `PromiseOrValue`<`BigNumberish`\>, `r`: `PromiseOrValue`<`BytesLike`\>, `s`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`: (`owner`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `deadline`: `PromiseOrValue`<`BigNumberish`\>, `v`: `PromiseOrValue`<`BigNumberish`\>, `r`: `PromiseOrValue`<`BytesLike`\>, `s`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setAllowance`: (`source`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setAllowance(address,address,uint256)`: (`source`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setBalance`: (`who`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setBalance(address,uint256)`: (`who`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `symbol`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `symbol()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `totalSupply`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `totalSupply()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `transfer`: (`recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transfer(address,uint256)`: (`recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transferFrom`: (`spender`: `PromiseOrValue`<`string`\>, `recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transferFrom(address,address,uint256)`: (`spender`: `PromiseOrValue`<`string`\>, `recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\>  }[`K`]\>

Call a method on the contract using `callStatic` and cache the result with
a key made from the method name and arguments.

**`See`**

https://docs.ethers.org/v5/api/contract/contract/#contract-callStatic

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"symbol"`` \| ``"DOMAIN_SEPARATOR()"`` \| ``"PERMIT_TYPEHASH()"`` \| ``"allowance(address,address)"`` \| ``"approve(address,uint256)"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"balanceOf(address)"`` \| ``"burn(address,uint256)"`` \| ``"deauthorize(address)"`` \| ``"decimals()"`` \| ``"isAuthorized(address)"`` \| ``"mint(address,uint256)"`` \| ``"name()"`` \| ``"nonces(address)"`` \| ``"owner()"`` \| ``"permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"`` \| ``"setAllowance(address,address,uint256)"`` \| ``"setBalance(address,uint256)"`` \| ``"setOwner(address)"`` \| ``"symbol()"`` \| ``"totalSupply()"`` \| ``"transfer(address,uint256)"`` \| ``"transferFrom(address,address,uint256)"`` \| ``"DOMAIN_SEPARATOR"`` \| ``"PERMIT_TYPEHASH"`` \| ``"allowance"`` \| ``"approve"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"balanceOf"`` \| ``"burn"`` \| ``"deauthorize"`` \| ``"decimals"`` \| ``"isAuthorized"`` \| ``"mint"`` \| ``"name"`` \| ``"nonces"`` \| ``"owner"`` \| ``"permit"`` \| ``"setAllowance"`` \| ``"setBalance"`` \| ``"setOwner"`` \| ``"totalSupply"`` \| ``"transfer"`` \| ``"transferFrom"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the method to call on the contract. |
| `args` | { `DOMAIN_SEPARATOR`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `DOMAIN_SEPARATOR()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `PERMIT_TYPEHASH`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `PERMIT_TYPEHASH()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `allowance`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `allowance(address,address)`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `approve`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `approve(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `balanceOf`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `balanceOf(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `burn`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `burn(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `decimals`: (`overrides?`: `CallOverrides`) => `Promise`<`number`\> ; `decimals()`: (`overrides?`: `CallOverrides`) => `Promise`<`number`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `mint`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `mint(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `name`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `name()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `nonces`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `nonces(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `permit`: (`owner`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `deadline`: `PromiseOrValue`<`BigNumberish`\>, `v`: `PromiseOrValue`<`BigNumberish`\>, `r`: `PromiseOrValue`<`BytesLike`\>, `s`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`: (`owner`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `deadline`: `PromiseOrValue`<`BigNumberish`\>, `v`: `PromiseOrValue`<`BigNumberish`\>, `r`: `PromiseOrValue`<`BytesLike`\>, `s`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setAllowance`: (`source`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setAllowance(address,address,uint256)`: (`source`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setBalance`: (`who`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setBalance(address,uint256)`: (`who`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `symbol`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `symbol()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `totalSupply`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `totalSupply()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `transfer`: (`recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transfer(address,uint256)`: (`recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transferFrom`: (`spender`: `PromiseOrValue`<`string`\>, `recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transferFrom(address,address,uint256)`: (`spender`: `PromiseOrValue`<`string`\>, `recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\>  }[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |

#### Returns

`ReturnType`<{ `DOMAIN_SEPARATOR`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `DOMAIN_SEPARATOR()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `PERMIT_TYPEHASH`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `PERMIT_TYPEHASH()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `allowance`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `allowance(address,address)`: (`arg0`: `PromiseOrValue`<`string`\>, `arg1`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `approve`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `approve(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `authorized`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `authorized(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `balanceOf`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `balanceOf(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `burn`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `burn(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `deauthorize(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `decimals`: (`overrides?`: `CallOverrides`) => `Promise`<`number`\> ; `decimals()`: (`overrides?`: `CallOverrides`) => `Promise`<`number`\> ; `isAuthorized`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `isAuthorized(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `mint`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `mint(address,uint256)`: (`account`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `name`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `name()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `nonces`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `nonces(address)`: (`arg0`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `owner`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `owner()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `permit`: (`owner`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `deadline`: `PromiseOrValue`<`BigNumberish`\>, `v`: `PromiseOrValue`<`BigNumberish`\>, `r`: `PromiseOrValue`<`BytesLike`\>, `s`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`: (`owner`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `deadline`: `PromiseOrValue`<`BigNumberish`\>, `v`: `PromiseOrValue`<`BigNumberish`\>, `r`: `PromiseOrValue`<`BytesLike`\>, `s`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setAllowance`: (`source`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setAllowance(address,address,uint256)`: (`source`: `PromiseOrValue`<`string`\>, `spender`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setBalance`: (`who`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setBalance(address,uint256)`: (`who`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `setOwner(address)`: (`who`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> ; `symbol`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `symbol()`: (`overrides?`: `CallOverrides`) => `Promise`<`string`\> ; `totalSupply`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `totalSupply()`: (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\> ; `transfer`: (`recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transfer(address,uint256)`: (`recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transferFrom`: (`spender`: `PromiseOrValue`<`string`\>, `recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\> ; `transferFrom(address,address,uint256)`: (`spender`: `PromiseOrValue`<`string`\>, `recipient`: `PromiseOrValue`<`string`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\>  }[`K`]\>

The value returned from the contract.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callStatic](ContractDataSource.md#callstatic)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:62](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L62)

___

### callWithSigner

▸ **callWithSigner**<`K`\>(`method`, `args`, `signer`, `options?`): `Promise`<`ContractTransaction`\>

Call a write method on the contract with a signer and wait for the
transaction to resolve. If the transaction fails, this will throw an error.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"fallback"`` \| ``"approve(address,uint256)"`` \| ``"authorize(address)"`` \| ``"burn(address,uint256)"`` \| ``"deauthorize(address)"`` \| ``"mint(address,uint256)"`` \| ``"permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"`` \| ``"setAllowance(address,address,uint256)"`` \| ``"setBalance(address,uint256)"`` \| ``"setOwner(address)"`` \| ``"transfer(address,uint256)"`` \| ``"transferFrom(address,address,uint256)"`` \| ``"approve"`` \| ``"authorize"`` \| ``"burn"`` \| ``"deauthorize"`` \| ``"mint"`` \| ``"permit"`` \| ``"setAllowance"`` \| ``"setBalance"`` \| ``"setOwner"`` \| ``"transfer"`` \| ``"transferFrom"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `K` | The name of the write method to call on the contract. |
| `args` | `MockERC20`[`K`] extends [`TransactionFunction`](../modules.md#transactionfunction) ? `Parameters`<`any`[`any`]\> : `never` | The array of arguments to pass to the method. |
| `signer` | `Signer` | The Signer to connect to the contract with before calling. |
| `options?` | [`TransactionOptions`](../interfaces/TransactionOptions.md) | - |

#### Returns

`Promise`<`ContractTransaction`\>

A promise that resolves to the `ContractTransaction`.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[callWithSigner](ContractDataSource.md#callwithsigner)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:83](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L83)

___

### clearCached

▸ **clearCached**(): `void`

Delete all entries from the cache.

#### Returns

`void`

#### Inherited from

[ContractDataSource](ContractDataSource.md).[clearCached](ContractDataSource.md#clearcached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:42](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L42)

___

### deleteCached

▸ **deleteCached**(`cacheKey`): `boolean`

Delete a single entry from the cache.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheKey` | `any` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[deleteCached](ContractDataSource.md#deletecached)

#### Defined in

[packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts:50](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/cached/CachedDataSource.ts#L50)

___

### deleteCall

▸ **deleteCall**<`K`\>(`method`, `args`): `boolean`

Delete the cache entry for a call to a given method with the given args.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"symbol"`` \| ``"deployed"`` \| ``"_deployed"`` \| ``"fallback"`` \| ``"connect"`` \| ``"attach"`` \| ``"_checkRunningEvents"`` \| ``"_wrapEvent"`` \| ``"queryFilter"`` \| ``"on"`` \| ``"once"`` \| ``"emit"`` \| ``"listenerCount"`` \| ``"listeners"`` \| ``"removeAllListeners"`` \| ``"off"`` \| ``"removeListener"`` \| ``"DOMAIN_SEPARATOR()"`` \| ``"PERMIT_TYPEHASH()"`` \| ``"allowance(address,address)"`` \| ``"approve(address,uint256)"`` \| ``"authorize(address)"`` \| ``"authorized(address)"`` \| ``"balanceOf(address)"`` \| ``"burn(address,uint256)"`` \| ``"deauthorize(address)"`` \| ``"decimals()"`` \| ``"isAuthorized(address)"`` \| ``"mint(address,uint256)"`` \| ``"name()"`` \| ``"nonces(address)"`` \| ``"owner()"`` \| ``"permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"`` \| ``"setAllowance(address,address,uint256)"`` \| ``"setBalance(address,uint256)"`` \| ``"setOwner(address)"`` \| ``"symbol()"`` \| ``"totalSupply()"`` \| ``"transfer(address,uint256)"`` \| ``"transferFrom(address,address,uint256)"`` \| ``"DOMAIN_SEPARATOR"`` \| ``"PERMIT_TYPEHASH"`` \| ``"allowance"`` \| ``"approve"`` \| ``"authorize"`` \| ``"authorized"`` \| ``"balanceOf"`` \| ``"burn"`` \| ``"deauthorize"`` \| ``"decimals"`` \| ``"isAuthorized"`` \| ``"mint"`` \| ``"name"`` \| ``"nonces"`` \| ``"owner"`` \| ``"permit"`` \| ``"setAllowance"`` \| ``"setBalance"`` \| ``"setOwner"`` \| ``"totalSupply"`` \| ``"transfer"`` \| ``"transferFrom"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `K` |
| `args` | `MockERC20`[`K`] extends [`AnyFunction`](../modules.md#anyfunction) ? `Parameters`<`any`[`any`]\> : `never` |

#### Returns

`boolean`

A boolean indicating whether the entry was successfully deleted.

#### Inherited from

[ContractDataSource](ContractDataSource.md).[deleteCall](ContractDataSource.md#deletecall)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:131](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L131)

___

### getAllowance

▸ **getAllowance**(`owner`, `spender`): `Promise`<`string`\>

Get the spending allowance of a given spender for a given owner of this
token.

#### Parameters

| Name | Type |
| :------ | :------ |
| `owner` | `string` |
| `spender` | `string` |

#### Returns

`Promise`<`string`\>

#### Implementation of

TokenDataSource.getAllowance

#### Defined in

[packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts:58](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts#L58)

___

### getBalanceOf

▸ **getBalanceOf**(`address`): `Promise`<`string`\>

Get the amount of tokens owned by a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

#### Implementation of

TokenDataSource.getBalanceOf

#### Defined in

[packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts:48](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts#L48)

___

### getDecimals

▸ **getDecimals**(): `Promise`<`number`\>

Get the number of decimals used to format a balance for display. For
example, if decimals equals 2, a balance of `505` tokens should be
displayed as `5.05` (`505 / 10 ** 2`).

#### Returns

`Promise`<`number`\>

#### Implementation of

TokenDataSource.getDecimals

#### Defined in

[packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts:41](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts#L41)

___

### getEvents

▸ **getEvents**<`TEvent`\>(`filter`, `fromBlock?`, `toBlock?`): `Promise`<`TEvent`[]\>

Get events from the contract and cache the results with a key made from the
filter and block range. If the request fails, the block range will be split
in 2 recursively until all events within the requested range are fetched.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`<`any`, `any`, `TEvent`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | `TypedEventFilter`<`TEvent`\> | The TypedEventFilter of the event to fetch. |
| `fromBlock?` | `number` | Include all events on or after this block. |
| `toBlock?` | `number` | Include all events on or before this block. |

#### Returns

`Promise`<`TEvent`[]\>

#### Inherited from

[ContractDataSource](ContractDataSource.md).[getEvents](ContractDataSource.md#getevents)

#### Defined in

[packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts:146](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/base/contract/ContractDataSource.ts#L146)

___

### getName

▸ **getName**(): `Promise`<`string`\>

Get the name of this token.

#### Returns

`Promise`<`string`\>

#### Implementation of

TokenDataSource.getName

#### Defined in

[packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts:25](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts#L25)

___

### getSymbol

▸ **getSymbol**(): `Promise`<`string`\>

Get the symbol of this token, usually a shorter version of the name.

#### Returns

`Promise`<`string`\>

#### Implementation of

TokenDataSource.getSymbol

#### Defined in

[packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts:32](https://github.com/delvtech/council-monorepo/blob/c29492c/packages/council-sdk/src/datasources/token/ERC20ContractDataSource.ts#L32)
