"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.convertToWebp = convertToWebp;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const uploadPath = path_1.default.join(process.cwd(), 'public/assets/uploads');
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
}
function getAvailableFilename(destination, originalName, ext) {
    let filename = `${originalName}${ext}`;
    let counter = 1;
    while (fs_1.default.existsSync(path_1.default.join(destination, filename))) {
        filename = `${originalName} (${counter})${ext}`;
        counter++;
    }
    return filename;
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
        const originalName = path_1.default.parse(file.originalname).name;
        const ext = path_1.default.extname(file.originalname);
        const finalName = getAvailableFilename(uploadPath, originalName, ext);
        cb(null, finalName);
    },
});
exports.upload = (0, multer_1.default)({ storage });
async function convertToWebp(filePath) {
    const { name } = path_1.default.parse(filePath);
    const webpPath = path_1.default.join(path_1.default.dirname(filePath), `${name}.webp`);
    await (0, sharp_1.default)(filePath)
        .webp({ quality: 80 })
        .toFile(webpPath);
    return webpPath;
}
