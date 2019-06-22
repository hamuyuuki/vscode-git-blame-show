'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';
// import * as os from 'os';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-git-blame-show" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let gitBlame = vscode.commands.registerCommand('extension.gitBlame', () => {
        // The code you place here will be executed every time your command is executed

        const workspaceFolderPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
        const documentAbsolutePath = vscode.window.activeTextEditor!.document.fileName;

        let result = null;
        if (documentAbsolutePath.includes(workspaceFolderPath)) {
            const documentRelativePath = documentAbsolutePath.replace(workspaceFolderPath + '/', '');
            result = child_process.execSync(`cd ${workspaceFolderPath} && git blame ${documentRelativePath}`).toString();
        } else {
            const splitedDocumentAbsolutePath = documentAbsolutePath.match(/^\/private\/tmp\/vscode-git-blame-show\/([a-zA-Z0-9_-]+)\/([a-z0-9]+)\/(.*)/);
            const commitNumber = splitedDocumentAbsolutePath![2]
            const documentRelativePath = splitedDocumentAbsolutePath![3]
            result = child_process.execSync(`cd ${workspaceFolderPath} && git blame ${commitNumber} ${documentRelativePath}`).toString();
        }

        const lines = result!.split("\n");

        for (let line in lines) {
            const words = lines[line].match(/^([a-z0-9^]*) \(([a-z0-9A-Z-_]*) *(\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d \+\d\d\d\d)/);

            const commit = words![1];
            const author = `${words![2]}____________`.substr(0, 12);
            const date = words![3];
            const decoration = vscode.window.createTextEditorDecorationType({
                isWholeLine: true,
                before: {
                    contentText: `${commit} ${author} ${date}`,
                    color: '#93a1a1',
                    backgroundColor: '#002b36',
                    border: "4px solid #002b36",
                    margin: "10px"
                },
            });
            const range = new vscode.Range(Number.parseInt(line), 10, Number.parseInt(line), 10);
            vscode.window.activeTextEditor!.setDecorations(decoration, [range]);
         }
    });

    let gitShow = vscode.commands.registerCommand('extension.gitShow', () => {
        const workspaceFolderPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
        const workspaceFolderName = vscode.workspace.workspaceFolders![0].name;
        const documentAbsolutePath = vscode.window.activeTextEditor!.document.fileName;

        let result = null;
        if (documentAbsolutePath.includes(workspaceFolderPath)) {
            const documentRelativePath = documentAbsolutePath.replace(workspaceFolderPath + '/', '');
            result = child_process.execSync(`cd ${workspaceFolderPath} && git blame ${documentRelativePath}`).toString();
        } else {
            const splitedDocumentAbsolutePath = documentAbsolutePath.match(/^\/private\/tmp\/vscode-git-blame-show\/([a-zA-Z0-9_-]+)\/([a-z0-9]+)\/(.*)/);
            const commitNumber = splitedDocumentAbsolutePath![2]
            const documentRelativePath = splitedDocumentAbsolutePath![3]
            result = child_process.execSync(`cd ${workspaceFolderPath} && git blame ${commitNumber} ${documentRelativePath}`).toString();
        }

        const lineNumber = vscode.window.activeTextEditor!.selection.active.line;
        const lines = result!.split("\n");
        const commit = lines[lineNumber].match(/^([a-z0-9^]*) \(([a-z0-9A-Z-_]*) *(\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d \+\d\d\d\d)/)![1].replace('^', '');

        child_process.execSync(`cd ${workspaceFolderPath} && git show ${commit} > /private/tmp/vscode-git-blame-show/${workspaceFolderName}/${commit}.log`).toString();

        var uri = vscode.Uri.parse(`file:///private/tmp/vscode-git-blame-show/${workspaceFolderName}/${commit}.log`);
        uri
        // vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc)).then(doc => vscode.languages.setTextDocumentLanguage(doc.document, "diff"));
    });

    let gitShowFile = vscode.commands.registerCommand('extension.gitShowFile', () => {
        const commitNumber = vscode.window.activeTextEditor!.document.getText(new vscode.Range(0,50,0,0)).split(" ")[1];

        const parentCommitNumber = child_process.execSync(`cd /Users/hamuyuuki32/src/github.com/hamuyuuki/dotfiles; git log -1 ${commitNumber} --pretty="format:%P"`).toString();

        child_process.execSync(`cd /Users/hamuyuuki32/src/github.com/hamuyuuki/dotfiles; mkdir /tmp/${parentCommitNumber}; git show ${parentCommitNumber}:setup.sh >/tmp/${parentCommitNumber}/setup.sh`).toString();
    });
    context.subscriptions.push(gitBlame);
    context.subscriptions.push(gitShow);
    context.subscriptions.push(gitShowFile);
}

// this method is called when your extension is deactivated
export function deactivate() {
}