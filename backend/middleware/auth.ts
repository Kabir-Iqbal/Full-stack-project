import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// interface for type which is exporting for using another files
export interface AuthRequest extends Request {
  user?: { id: string };
}

// authorization middleware function 
const auth = (req: AuthRequest, res: Response, next: NextFunction): any => {
  
  // Get the token from Authorization header and remove 'Bearer '
  const token = req.get('Authorization')?.replace('Bearer ', '');
  // if token is not pressent return unautorized
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
  // Verify the token using the secret key and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
    req.user = { id: decoded.userId }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;

