import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import dbService from '../services/db.service';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: 'user' | 'manager' | 'admin';
        name: string;
      };
    }
  }
}

// Optional Firebase Admin initialization
let firebaseAdminInitialized = false;
if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL
) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    firebaseAdminInitialized = true;
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Check for development mock tokens first to allow easy role testing
    if (process.env.NODE_ENV !== 'production' || !firebaseAdminInitialized) {
      if (token === 'mock_user' || token === 'user_demo_123') {
        const user = await dbService.findUserById('user_demo_123');
        if (user) {
          req.user = { uid: user._id, email: user.email, role: user.role, name: user.name };
          return next();
        }
      } else if (token === 'mock_manager' || token === 'manager_demo_123') {
        const user = await dbService.findUserById('manager_demo_123');
        if (user) {
          req.user = { uid: user._id, email: user.email, role: user.role, name: user.name };
          return next();
        }
      } else if (token === 'mock_admin' || token === 'admin_demo_123') {
        const user = await dbService.findUserById('admin_demo_123');
        if (user) {
          req.user = { uid: user._id, email: user.email, role: user.role, name: user.name };
          return next();
        }
      }
      
      // Allow general format user_xxx mock tokens
      if (token.startsWith('mock_')) {
        const userId = token;
        const user = await dbService.findUserById(userId);
        if (user) {
          req.user = { uid: user._id, email: user.email, role: user.role, name: user.name };
          return next();
        }
        // If user doesn't exist in local mock DB yet, create it on the fly
        const email = `${token.substring(5)}@travelmate.ai`;
        const name = token.substring(5).charAt(0).toUpperCase() + token.substring(6);
        const newUser = await dbService.createUser({
          _id: userId,
          email,
          name,
          role: 'user',
          createdAt: new Date().toISOString()
        });
        req.user = { uid: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name };
        return next();
      }
    }

    // Standard Firebase Auth Token verification
    if (firebaseAdminInitialized) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        
        // Lookup user in DB to check role
        let user = await dbService.findUserById(uid);
        if (!user) {
          // If not in DB, auto-register as basic user
          user = await dbService.createUser({
            _id: uid,
            email: decodedToken.email || '',
            name: decodedToken.name || 'Traveler',
            role: 'user',
            avatarUrl: decodedToken.picture || '',
            createdAt: new Date().toISOString()
          });
        }
        
        req.user = {
          uid: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        };
        return next();
      } catch (fbError) {
        return res.status(401).json({ success: false, message: 'Invalid Firebase ID token', error: fbError });
      }
    }

    return res.status(401).json({ 
      success: false, 
      message: 'Unconfigured authorization: Firebase Admin is not set up and token did not match mock credentials.' 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authentication error', error });
  }
};
