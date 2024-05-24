const vscode = require("vscode");
const fs = require("fs");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.copyFileContentByTyping",
    async () => {
      // Read the content of the source file
      fs.readFile("./auto-type/index.txt", "utf8", async (err, data) => {
        if (err) {
          vscode.window.showErrorMessage(`Could not read file: ${err.message}`);
          return;
        }

        // Open the target file in the editor
        const document = await vscode.workspace.openTextDocument(
          vscode.window.activeTextEditor.document.uri.fsPath
        );
        const editor = await vscode.window.showTextDocument(document);

        let openDoubleQuote = false;
        let openSingleQuote = false;

        const startPoint = data.indexOf("⇘") + 1;
        let endPoint = data.indexOf("⇖");
        if (endPoint === -1) endPoint = data.length;

        // Type out the content
        for (let i = startPoint; i < endPoint; i++) {
          const position = editor.selection.active;
          const newPosition = position.translate(0, 1);

          switch (data[i]) {
            // Prevent extra line breaks
            case "\r":
              continue;

            case "~":
              // Copy and paste the text between ~ and ^
              const copyText = data.slice(i + 1, data.indexOf("^", i));
              await vscode.env.clipboard.writeText(copyText);
              await vscode.commands.executeCommand(
                "editor.action.clipboardPasteAction"
              );
              i = data.indexOf("^", i);
              continue;

            case " ":
              if (data[i + 1] === " ") {
                let j = i + 2;
                let spaces = "  ";
                while (data[j] === " " && j < data.length) {
                  j++;
                  spaces += " ";
                }
                await editor.edit((editBuilder) => {
                  editBuilder.insert(position, spaces);
                });
                i = j - 1;
                continue;
              }
              break;

            case '"':
              openDoubleQuote = !openDoubleQuote;
              if (openDoubleQuote) {
                await editor.edit((editBuilder) => {
                  editBuilder.insert(position, '""');
                });
              }
              editor.selection = new vscode.Selection(newPosition, newPosition);
              continue;

            case "'":
              openSingleQuote = !openSingleQuote;
              if (openSingleQuote) {
                await editor.edit((editBuilder) => {
                  editBuilder.insert(position, "''");
                });
              }
              editor.selection = new vscode.Selection(newPosition, newPosition);
              continue;

            case "{":
              await editor.edit((editBuilder) => {
                editBuilder.insert(position, "{}");
              });
              editor.selection = new vscode.Selection(newPosition, newPosition);
              continue;

            case "(":
              await editor.edit((editBuilder) => {
                editBuilder.insert(position, "()");
              });
              editor.selection = new vscode.Selection(newPosition, newPosition);
              continue;

            case "[":
              await editor.edit((editBuilder) => {
                editBuilder.insert(position, "[]");
              });
              editor.selection = new vscode.Selection(newPosition, newPosition);
              continue;

            case "<":
              await editor.edit((editBuilder) => {
                editBuilder.insert(position, "<>");
              });
              editor.selection = new vscode.Selection(newPosition, newPosition);
              continue;

            default:
              if (["}", ")", "]", ">"].includes(data[i])) {
                editor.selection = new vscode.Selection(
                  newPosition,
                  newPosition
                );
                await new Promise((resolve) =>
                  setTimeout(resolve, Math.random() * 200 + 100)
                );
                continue;
              }
              break;
          }

          if (data[i] !== " " && data[i - 1] === " " && data[i - 2] === " ") {
            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 100 + 300)
            );
          }

          await editor.edit((editBuilder) => {
            editBuilder.insert(position, data[i]);
          });

          // Small delay to simulate typing
          if (
            (data[i] !== "\n" || data[i + 1] !== " ") &&
            data[i] !== '"' &&
            data[i] !== "'" &&
            data[i] !== "=" &&
            data[i] !== "/" &&
            data[i] !== ">"
          ) {
            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 200 + 100)
            );
          }
        }

        // vscode.window.showInformationMessage("Done Typing");
      });
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
