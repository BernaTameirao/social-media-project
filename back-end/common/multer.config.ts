import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import * as path from 'path';

export const multerConfig = {
	storage: diskStorage({
		destination: './uploads/',
		filename: (req, file, cb) => {
		const uniqueName =
			crypto.randomUUID() +
			path.extname(file.originalname);

		cb(null, uniqueName);
		}
	}),
	limits: {
		fileSize: 5 * 1024 * 1024
	},
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Only images allowed'), false);
		}
		cb(null, true);
	}
};