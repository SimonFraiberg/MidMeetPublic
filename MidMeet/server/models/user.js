const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  location: {
    address: {
      type: String,
      default: null,
    },
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
  profilePic: {
    type: String,
    required: true,
  },
  TwoFA: {
    enabled: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
      default: null,
    },
    qr: {
      type: String,
      default: null,
    },
  },

  preferences: {
    food: [
      {
        type: String,
        default: null,
      },
    ],
    foodRestrictions: [
      {
        type: String,
        default: null,
      },
    ],
    activities: [
      {
        type: String,
        default: null,
      },
    ],
    default: {},
  },

  meets: [
    {
      type: String,
      default: null,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
