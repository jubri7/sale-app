export const redisClient = {
  write: jest
    .fn()
    .mockImplementation(
      async (key: string, value: string): Promise<string | null> => {
        return null;
        return await Promise.resolve().then(() => '{"im":done}');
      }
    ),
  read: jest
    .fn()
    .mockImplementation(async (key: string): Promise<string | null> => {
      return null;
      return await Promise.resolve().then(() => '{"im":done}');
    }),
  client: {
    del: jest
      .fn()
      .mockImplementation(
        (key: string, callback?: () => Number | undefined): boolean => {
          return true;
        }
      ),
  },
};
