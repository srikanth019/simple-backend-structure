// "use strict"; // Not necessary in ES6 modules

import { messages } from "./messages";
import { validations } from "./validations";
import { errors } from "./errors";

const enTranslations = { ...messages, ...validations, ...errors };

export { enTranslations };
