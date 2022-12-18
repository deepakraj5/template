import { Router } from 'express';
import { auth } from '../middleware/auth';
import { uploadVideoToS3 } from '../service/video';

const router = Router();

// upload video
router.post('/video/upload', auth, (req, res) => uploadVideoToS3(req, res));

export default router;
