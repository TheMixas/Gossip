import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dAvatarPath = path.join(__dirname, '../user_images/defaultAvatar.png')
const defaultAvatar = fs.readFileSync(dAvatarPath)

const dBannerPath = path.join(__dirname, '../user_images/defaultBanner.jpg')
const defaultBanner = fs.readFileSync(dBannerPath)

const dImagePath = path.join(__dirname, '../user_posts_images/defaultImage.png')
const defaultImage = fs.readFileSync(dImagePath)
export default {
    //Cache backup images on start
    'defaultAvatar.png' :defaultAvatar,
    'defaultBanner.jpg': defaultBanner,
    'defaultImage.png': defaultImage
};

