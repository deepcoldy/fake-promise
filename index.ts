import fakePromise from "./fake-promise";

const 

  window.a = new fakePromise((resolve, reject) => {
    if (true) {
      setTimeout(() => {
        console.log(resolve)
        resolve(1)
      }, 1000);
    } else {
      reject(2)
    }
  })

a.then((value) => {
  console.log(value)
  return value
}, (error) => {
  console.log(error)
  return error
})