# QuickJS eval

Run javascript in a quickjs wasm in browser.

Inspired by https://github.com/maple3142/wasm-jseval (only works in nodejs)

## Usage

```sh
npm i quickjs-eval
```

```html
<script src="https://unpkg.com/quickjs-eval/dist/index.js"></script>
<script>
  const { getInstance } = quickjsEval
</script>
```

```js
import { getInstace } from 'quickjs-eval'

getInstance().then(({ eval, newFunction }) => {
  const total = eval('1 + 2 + 3')
  console.log(total)

  const fn = newFunction(['a', 'b'], 'return a + b')
  const sum = fn(1, 2)
  console.log(sum)
})
```

## Development

You should first activate Emscripten and make sure `emcc` work.
