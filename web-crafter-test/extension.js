// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Test");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "web-crafter-test.test-command",
    async function () {
      // The code you place here will be executed every time your command is executed

      const options = [
        {
          label: "Option 1",
          description: "Option 1 Description",
          detail: "Option 1 Detail",
          more: "Option 1 More",
          fun: () => {
            console.log("Hello from inside option 1");
          },
          options: [
            {
              label: "Option 1.1",
              description: "Option 1.1 Description",
            },
          ],
        },
        {
          label: "Option 2",
          description: "Option 2 Description",
          detail: "Option 2 Detail",
          more: "Option 2 More",
          fun: () => {
            console.log("Hello from inside option 2");
          },
        },
      ];
      const option = await vscode.window.showQuickPick(options, {
        matchOnDetail: true,
        placeHolder: "Select an option to continue...",
      });

      if (!option) return;

      console.log(option);
      option.fun();

      // If the option has sub options
      if (option.options) {
        const subOption = await vscode.window.showQuickPick(option.options, {
          matchOnDetail: true,
          placeHolder: "Select an option to continue...",
        });
        if (!subOption) return;
        console.log(subOption);
      }

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from Web Crafter Test!"
      );
    }
  );

  context.subscriptions.push(disposable);

  // Add a new command
  let newCommand = vscode.commands.registerCommand(
    "web-crafter-test.new-command",
    function () {
      console.log("New Command is called");
      vscode.window.showInformationMessage("New Command");
    }
  );
  context.subscriptions.push(newCommand);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
