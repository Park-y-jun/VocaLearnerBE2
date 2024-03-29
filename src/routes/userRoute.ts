import { Router } from "express";
import { signUp, signIn } from "../controllers/userController";

const router = Router();

router.post('/sign-up', signUp)

router.post("/sign-in", signIn);

export default router;