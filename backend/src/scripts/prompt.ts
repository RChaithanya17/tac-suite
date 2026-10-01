import readline from "readline";

export const ask = (question: string, hidden = false): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  if (hidden) {
    // Hide typed characters for password input
    const rlWithOutput = rl as unknown as {
      _writeToOutput: (text: string) => void;
    };

    rlWithOutput._writeToOutput = (text: string) => {
      if (text.includes(question)) {
        process.stdout.write(text);
      } else if (text === "\r\n" || text === "\n") {
        process.stdout.write("\n");
      } else {
        process.stdout.write("*".repeat(text.length));
      }
    };
  }

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const MIN_PASSWORD_LENGTH = 8;
