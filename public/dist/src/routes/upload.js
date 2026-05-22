"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadHandler_1 = require("../utils/uploadHandler");
const config_1 = __importDefault(require("../config"));
const errors_1 = require("../utils/errors");
const router = express_1.default.Router();
router.post('/upload', uploadHandler_1.upload.array('images'), async (req, res) => {
    const files = req.files;
    try {
        if (!config_1.default.convertToWebp) {
            res.redirect('/');
        }
        else {
            await Promise.all(files.map(file => (0, uploadHandler_1.convertToWebp)(file.path)));
            res.redirect('/');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: errors_1.ERROR_CODES["TEP431"] });
    }
});
exports.default = router;
