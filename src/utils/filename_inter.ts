import { extname } from "path";

export const intFileName = async (req, file, cb) => {
  return cb(null, `${req.body.userName}${extname(file.originalname)}`);
};
