jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// 테스트에서는 실제 네트워크를 쓰지 않는다. 필요한 테스트는 fetch를 직접 넘긴다.
global.fetch = jest.fn(() => Promise.reject(new Error('테스트에서는 네트워크를 쓰지 않아요'))) as unknown as typeof fetch;
