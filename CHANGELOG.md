# @gamestdio/timer

## 1.4.0

### Minor Changes

- 9975b29: Add a new async scheduling function `duration` for usage with async functions.

  **Inside an async function**

  ```typescript
  const timer = new Clock(true);
  await timer.duration(1000);
  console.log("1 second later");
  ```

  **Using the promise**

  ```typescript
  const timer = new Clock(true);
  timer.duration(1000).then(() => console.log("1 second later"));
  ```

  **Using the promise with error**

  ```typescript
  const timer = new Clock(true);
  timer
    .duration(1000)
    .then(() => console.log("1 second later"))
    .catch(() => console.log("Timer cleared"));
  timer.clear();
  ```
