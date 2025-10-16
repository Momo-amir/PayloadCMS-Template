export default class Command {
  constructor(public command: string) { }

  public static registeredCommands: Record<string, Command> = {}
  public static register(command: string | Command) {
    if (typeof command === "string") {
      command = new Command(command)
    }
    if (!this.registeredCommands[command.command]) {
      this.registeredCommands[command.command] = command
    }
  }

  /**
   * Executes a registered command from a string input.
   */
  public static executeFromString(commandString: string) {
    const [command, ...rawArgs] = commandString.split(" ");

    const args: string[] = [];
    const keyargs: {
      [key: string]: string | number | boolean;
    } = {};

    while (rawArgs.length) {
      const arg = rawArgs.shift();
      if (!arg) continue;
      if (arg.startsWith("--")) {
        const [key, value] = arg.slice(2).split("=");
        if (value === undefined) {
          keyargs[key] = true;
        } else if (value === "true") {
          keyargs[key] = true;
        } else if (value === "false") {
          keyargs[key] = false;
        } else if (!isNaN(Number(value))) {
          keyargs[key] = Number(value);
        } else {
          keyargs[key] = value;
        }
      } else {
        args.push(arg);
      }
    }

    const cmd = this.registeredCommands[command]
    if (cmd) {
      if (keyargs.help === true)
        Command.executeFromString(`help ${command}`);
      else {
        cmd.run(keyargs, ...args);
      }
    }
    else {
      console.error(`Command not found: ${command}`)
    }
  }

  // Fields
  public description?: string;
  public setDescription(description: string) {
    this.description = description;
    return this;
  }

  public syntax?: string;
  public setSyntax(syntax: string) {
    this.syntax = syntax;
    return this;
  }

  public callback?: CommandCallback;
  public setCallback(callback: CommandCallback) {
    this.callback = callback;
    return this;
  }

  // Execute

  public run(keyArgs: { [key: string]: string | number | boolean }, ...args: string[]) {
    return this.callback?.(keyArgs, ...args);
  }
}

type CommandCallback = (keyArgs: { [key: string]: string | number | boolean }, ...args: string[]) => void;

// Add help command
Command.register(
  new Command("help")
    .setDescription("Display help information about commands")
    .setCallback((_, cmd) => {
      if (cmd) {
        const command = Command.registeredCommands[cmd];
        if (command) {
          console.log(command.command);
          if (command.syntax) {
            console.log(`  Usage: ${command.command} ${command.syntax}`);
          }
          if (command.description) {
            console.log(`  ${command.description}`);
          }
        } else {
          console.error(`Command not found: ${cmd}`);
        }
        return;
      }
      const commands = Object.values(Command.registeredCommands);
      const longest = commands.reduce((max, cmd) => Math.max(max, cmd.command.length + (cmd.syntax?.length || -1) + 1), 0);
      console.log("Available commands:");
      commands.forEach((cmd) => {
        console.log(`  ${`${cmd.command} ${cmd.syntax ? `${cmd.syntax}` : ""}`.padEnd(longest)} - ${cmd.description || "No description"}`);
      });
    })
);