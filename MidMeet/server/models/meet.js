const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  creator: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  recommendations: [
    {
      voted: [String],
      restaurant: {
        wheelchairAccessibleEntrance: {
          type: Boolean,
          default: null,
        },
        currentOpeningHours: [
          {
            type: String,
          },
        ],
        priceLevel: {
          type: String,
          default: null,
        },
        rating: {
          type: Number,
          default: null,
        },
        photoRef: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
        displayName: {
          type: String,
          default: null,
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
      },

      activity: {
        wheelchairAccessibleEntrance: {
          type: Boolean,
          default: null,
        },
        currentOpeningHours: [
          {
            type: String,
          },
        ],
        priceLevel: {
          type: String,
          default: null,
        },
        rating: {
          type: Number,
          default: null,
        },
        photoRef: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
        displayName: {
          type: String,
          default: null,
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
      },
    },
  ],
  participants: [
    {
      email: {
        type: String,
        default: null,
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
    },
  ],
});

module.exports = mongoose.model("Meet", MeetingSchema);
