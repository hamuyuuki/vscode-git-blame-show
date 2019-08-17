import * as vscode from 'vscode';

export class FtpTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

	public refresh(): any {
		this._onDidChangeTreeData.fire();
	}


	public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: vscode.TreeItem): vscode.TreeItem[] | Thenable<vscode.TreeItem[]> {
		return [new vscode.TreeItem("aaaaaaaaaaaaaaaaaa" , vscode.TreeItemCollapsibleState.None), new vscode.TreeItem(vscode.Uri.parse("file:///test/test1") , vscode.TreeItemCollapsibleState.None)];
	}

	public getParent(element: vscode.TreeItem): vscode.TreeItem {
		return null;
	}
}

export class FtpExplorer {

	private ftpViewer: vscode.TreeView<vscode.TreeItem>;

	constructor(context: vscode.ExtensionContext) {
		const treeDataProvider = new FtpTreeDataProvider();
		this.ftpViewer = vscode.window.createTreeView('ftpExplorer', { treeDataProvider });
	}
}