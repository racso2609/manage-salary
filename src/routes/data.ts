import { Router } from 'express';
import { protect } from '../authenticate';
import { getTotalAvaliable } from '../controllers/dataController';
const router = Router();

router.get('/totals', protect, getTotalAvaliable);

const dataRouter = router;
export default dataRouter;
