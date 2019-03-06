export default function CatchPromise(fn) {
  return new Promise((resolve, rejct) => {
    fn.then(res => resolve(res)).catch(e => resolve(false,e))
  })
}
