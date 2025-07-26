const Message = require('../models/Message');
const User = require('../models/User');

// Send message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text', bookingId } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType,
      bookingId
    });

    await message.save();

    // Populate sender and receiver details
    await message.populate([
      { path: 'sender', select: 'name email profileImage' },
      { path: 'receiver', select: 'name email profileImage' }
    ]);

    res.status(201).json({
      message: 'Message sent successfully',
      message: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate([
      { path: 'sender', select: 'name email profileImage' },
      { path: 'receiver', select: 'name email profileImage' }
    ])
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(messages.length / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's conversations list
const getConversations = async (req, res) => {
  try {
    // Get all unique conversations for the user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate user details for each conversation
    const populatedConversations = await Message.populate(conversations, [
      { path: 'lastMessage.sender', select: 'name email profileImage' },
      { path: 'lastMessage.receiver', select: 'name email profileImage' },
      { path: '_id', select: 'name email profileImage', model: 'User' }
    ]);

    res.json(populatedConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;

    await Message.updateMany(
      { sender: senderId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUnreadCount
}; 