const mongoose = require('mongoose');

// Define the Settings schema
const SettingsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation
    },
    theme: {
      type: String,
      enum: ['light', 'dark'], // Example setting for theme preference
      default: 'light',
    },
    notifications: {
      type: Boolean, // Enable or disable notifications
      default: true,
    },
    language: {
      type: String, // Preferred language setting
      default: 'en',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Settings model
const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;
