import * as vscode from 'vscode';

export class SampleTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  onDidChangeTreeData?: vscode.Event<vscode.TreeItem | null | undefined> | undefined;  getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
  getChildren(element?: vscode.TreeItem | undefined): vscode.ProviderResult<vscode.TreeItem[]> {
    throw new Error("Method not implemented.");
  }
}
