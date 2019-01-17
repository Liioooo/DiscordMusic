const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const ffmpegBasePath = path.join(
    process.cwd(),
    'node_modules',
    'ffmpeg-static',
    'bin',
);

const ffmpegBaseDest = path.join(
  process.cwd(),
  'release'
);


switch (args[0]) {
    case '--win32':
        copyWin32();
        break;
    case '--win64':
        copyWin64();
        break;
    case '--mac':
        copyMac();
        break;
    case '--linux':
        copyLinux();
        break;
}

function copyWin32() {
    fs.mkdirSync(path.join(ffmpegBaseDest, 'DiscordMusic-win32-ia32', 'bin'));
    fs.copyFileSync(path.join(ffmpegBasePath, 'win32', 'ia32', 'ffmpeg.exe'), path.join(ffmpegBaseDest, 'DiscordMusic-win32-ia32', 'bin', 'ffmpeg.exe'));
}

function copyWin64() {
    fs.mkdirSync(path.join(ffmpegBaseDest, 'DiscordMusic-win32-x64', 'bin'));
    fs.copyFileSync(path.join(ffmpegBasePath, 'win32', 'x64', 'ffmpeg.exe'), path.join(ffmpegBaseDest, 'DiscordMusic-win32-x64', 'bin', 'ffmpeg.exe'));
}

function copyMac() {

}

function copyLinux() {

}