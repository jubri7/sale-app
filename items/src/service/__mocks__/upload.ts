import fs from "fs";

export const UploadImage = {
  upload: jest
    .fn()
    .mockImplementation(
      async (file: Express.Multer.File): Promise<string | null> => {
        return "test url";
      }
    ),
  unlinkFile: jest
    .fn()
    .mockImplementation(async (path: fs.PathLike): Promise<void> => {}),
};
