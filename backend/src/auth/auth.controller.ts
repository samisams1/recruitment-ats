import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';

export const authRouter = Router();

export function setupAuthRoutes(authService: AuthService) {
  authRouter.post('/register', async (req: Request, res: Response): Promise<any> => {
    try {
      const result = await authService.registerUser(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  authRouter.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
      const result = await authService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  });
}
