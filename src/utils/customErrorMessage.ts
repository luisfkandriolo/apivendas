import { LanguageMessages } from 'joi';

const customErrorMessage = (
  field: string | number,
  type: string,
  segment: string,
  defaultMessageError: string,
): string | Record<string, string> => {
  const customErrors: LanguageMessages = {
    'string.empty': `${field} cant be empty (${segment})`,
    'number.precision': `${field} decimals are invalid (${segment})`,
    'any.required': `${field} is required (${segment})`,
    'any.unknown': `${field} is not allowed (${segment})`,
    'object.unknown': `${field} is not allowed (${segment})`,
    'string.guid': `${field} is not valid uuid (${segment})`,
  };

  const returnMessage = customErrors[type as keyof LanguageMessages]
    ? customErrors[type as keyof LanguageMessages]
    : defaultMessageError;

  return returnMessage;
};

export default customErrorMessage;
