"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entryController = exports.blockController = exports.collectionController = void 0;
var collectionController_1 = require("./collectionController");
Object.defineProperty(exports, "collectionController", { enumerable: true, get: function () { return __importDefault(collectionController_1).default; } });
var blockController_1 = require("./blockController");
Object.defineProperty(exports, "blockController", { enumerable: true, get: function () { return __importDefault(blockController_1).default; } });
var entryController_1 = require("./entryController");
Object.defineProperty(exports, "entryController", { enumerable: true, get: function () { return __importDefault(entryController_1).default; } });
