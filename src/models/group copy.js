"use strict";
exports.__esModule = true;
exports.Group = void 0;
var mongoose_1 = require("mongoose");
var groupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    members: {
        type: [mongoose_1.Schema.Types.ObjectId],
        "default": [],
        ref: 'User'
    },
    groupStatistics: {
        type: Object,
        validate: {
            validator: function (val) {
                var isWeekValid = val.week && typeof val.week.km === "number" && typeof val.week.elevationGain === "number";
                var isMonthValid = val.month && typeof val.month.km === "number" && typeof val.month.elevationGain === "number";
                var isYearValid = val.year && typeof val.year.km === "number" && typeof val.year.elevationGain === "number";
                return isWeekValid && isMonthValid && isYearValid;
            }
        },
        required: false
    },
    userClasification: {
        type: [Number],
        "default": []
    },
    favouriteTracks: {
        type: [mongoose_1.Schema.Types.ObjectId],
        "default": []
    },
    tracksHistory: {
        type: [Object],
        "default": []
    }
});
exports.Group = (0, mongoose_1.model)('Group', groupSchema);
