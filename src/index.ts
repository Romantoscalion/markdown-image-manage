import { logger, mdCheck, showInVscode, setPara, readonly } from './common';
import { cleanMD, analyze } from './clean';
import { download } from './download';
import { upload, upCheck, linkPicgo } from './upload';
import { move } from './move';
import { getLang } from './lang';
import * as fs from 'fs';

import * as vscode from 'vscode';
/*
import * as nls from 'vscode-nls';
const localize = nls.config({
    bundleFormat: nls.BundleFormat.standalone,
    messageFormat: nls.MessageFormat.both
})();
//const localize = nls.loadMessageBundle();
// 匹配对应的 i18n\zh-cn\xxx.i18n.json 文件
// 打开新文件
// let document = vscode.window.activeTextEditor?.document;
// if(document != null)
// {
//     let pat = 'd:\\test.txt';
//     let newUri = document.uri.with({ path: pat });
//     await vscode.window.showTextDocument(newUri, { preview: false });
// }
*/

export async function vscAnalyze() {
    // vscode.window.showInformationMessage(getLang('md-img.hello'))
    analyze();
    showInVscode();
}
export async function vscClean() {
    cleanMD();
    showInVscode();
}
export async function vscDownload() {
    download();
}
// 上传所选图片
export async function vscUpload() {
    if (upCheck()) {
        showInVscode();
        return;
    }
    //upload();
}
// 上传全部图片
export async function vscUploadAll() {
    if (upCheck()) {
        showInVscode();
        return;
    }
    //upload();
}
// 初始化参数，参数保存于 common模块中
export function initPara() {
    let extendName = 'markdown-image-manage';
    let hasBracket: boolean = vscode.workspace.getConfiguration(extendName).get('hasBracket') as boolean;
    let updateLink: boolean = vscode.workspace.getConfiguration(extendName).get('updateLink') as boolean;
    let rename: boolean = vscode.workspace.getConfiguration(extendName).get('rename') as boolean;
    let remotePath: string = vscode.workspace.getConfiguration(extendName).get('remotePath') || '<filename>';
    let imageSaveFolder: string = vscode.workspace.getConfiguration(extendName).get('imageSaveFolder') || '<filename>.assets';
    let removeFolder: string = vscode.workspace.getConfiguration(extendName).get('removeFolder') || 'md-img-remove';

    //const isAsync: boolean = vscode.workspace.getConfiguration().get('downloadImageInMarkdown.isAsync') as boolean;
    setPara(hasBracket, rename, updateLink, imageSaveFolder, remotePath, removeFolder);

    let file = vscode.window.activeTextEditor?.document.uri.fsPath || '';
    if (!mdCheck(file)) {
        showInVscode();
        return false;
    }
    return true;
}

export async function vscMove() {
    const result = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: getLang('md-img.moveHint')
    });

    if (!result || result.length === 0) {
        return;
    }

    let localFolder: string = result[0].fsPath;
    console.log(`Will Move images to localFolder[${localFolder}]`)
    move(localFolder);
    showInVscode();
}