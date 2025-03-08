import express from 'express';

import {
  handleChatRequest,
  handleStreamingChatRequest,
} from '../controllers/chatController';

const router = express.Router();

// Route for regular (non-streaming) chat
router.post('/', handleChatRequest);

// Route for streaming chat
router.post('/stream', handleStreamingChatRequest);

export default router;
