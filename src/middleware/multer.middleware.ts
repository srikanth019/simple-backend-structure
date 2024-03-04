import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${Date.now()}-${originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fieldSize: 100000000, files: 2 },
});
