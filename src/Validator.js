const ErrorMessages = require("./ErrorMessages");
const config = require("./config");

const fs = require("fs");
const path = require("path");

function Validator() {}

Validator.performAllValidations = function (targetDirectory) {
  let errors = {};

  errors = validateTargetDirExists(targetDirectory);
  printAndExitOnError(errors);

  errors = validateTargetDirIsValid(targetDirectory);
  printAndExitOnError(errors);
};

function printAndExitOnError(errors) {
  if (errors.hasErrors()) {
    console.log(errors.toString());
    process.exit(config.setAtRuntime.enableErrorExitCode ? 1 : 0);
  }
}

function validateTargetDirExists(targetDirectory) {
  const absolutePathTargetDir = path.resolve(targetDirectory);
  const errors = new ErrorMessages();

  if (!fs.existsSync(targetDirectory)) {
    errors.addError(
      "Target directory does not exist.\n" +
        `  Target directory: ${absolutePathTargetDir}`
    );
  }

  return errors;
}

function validateTargetDirIsValid(targetDirectory) {
  const absolutePathTargetDir = path.resolve(targetDirectory);
  const errors = new ErrorMessages();

  if (
    !fs.existsSync(path.join(targetDirectory, config.requiredFiles.testCases))
  ) {
    errors.addError(
      `${config.requiredFiles.testCases} is not present in target directory.\n` +
        `  Target directory: ${absolutePathTargetDir}`
    );
  }

  let validSolutionFileExists = false;
  for (extension of config.supportedLanguages) {
    if (
      fs.existsSync(
        path.join(
          targetDirectory,
          `${config.requiredFiles.solutionFileName}.${extension}`
        )
      )
    ) {
      validSolutionFileExists = true;
      break;
    }
  }

  if (!validSolutionFileExists) {
    errors.addError(
      `Solution file of a supported language is not present in target directory.\n` +
        `  Target directory: ${absolutePathTargetDir}\n` +
        `  Supported laguages: ${config.supportedLanguages}`
    );
  }

  return errors;
}

module.exports = Validator;
