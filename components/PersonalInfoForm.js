import { DicesIcon } from "../../../Icons";
import {
  Input,
  FormRow,
  Button,
} from "../../../UiComponents";
import { generatePassword } from "../utils";
import { MAGIC_STRINGS, LOCALES } from "./const";

export const PersonalInfoForm = (props) => {
  const {
    userInfo,
    newUser,
    setValue,
    validate,
    internalErrors,
    errorsServer,
    permissions,
  } = props;

  return (
    <FormRow>
      <Input
        id={MAGIC_STRINGS.username}
        label={LOCALES.login}
        disabled={!permissions.editUsername}
        autoComplete="off"
        value={userInfo.username}
        onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.username], value)}
        onBlur={(value) => {
          validate(MAGIC_STRINGS.username, value);
        }}
        error={
          internalErrors.username ||
          errorsServer.find((el) =>
            [MAGIC_STRINGS.username, MAGIC_STRINGS.usernameCanonical].includes(el.key)
          )
        }
      />

      {permissions.editPassword && (
        <Input
          id={MAGIC_STRINGS.password}
          label={LOCALES.password}
          value={userInfo.password}
          autoComplete="off"
          onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.password], value)}
          onBlur={(value) => {
            if (newUser) validate(MAGIC_STRINGS.password, value);
          }}
          error={
            internalErrors.password ||
            errorsServer.find((el) => el.key === MAGIC_STRINGS.password)
          }
          after={
            <Button
              type={MAGIC_STRINGS.text}
              tooltip={LOCALES.generate}
              onClick={(e) => {
                e.preventDefault();
                setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.password], generatePassword());
              }}
            >
              <DicesIcon />
            </Button>
          }
        />
      )}
      <Input
        id={MAGIC_STRINGS.surname}
        label={LOCALES.surname}
        placeholder={LOCALES.surnameDefault}
        disabled={!permissions.editFIO}
        value={userInfo.surname}
        onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.surname], value)}
        onBlur={(value) => {
          validate(MAGIC_STRINGS.surname, value);
        }}
        error={internalErrors.surname}
      />
      <Input
        id={MAGIC_STRINGS.firstname}
        label={LOCALES.name}
        placeholder={LOCALES.nameDefault}
        disabled={!permissions.editFIO}
        value={userInfo.firstname}
        onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.firstname], value)}
        onBlur={(value) => {
          validate(MAGIC_STRINGS.firstname, value);
        }}
        error={internalErrors.firstname}
      />
      <Input
        id={MAGIC_STRINGS.patronymic}
        label={LOCALES.patronymic}
        placeholder={LOCALES.patronymicDefault}
        disabled={!permissions.editFIO}
        value={userInfo.patronymic}
        onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.patronymic], value)}
      />
    </FormRow>
  );
};

export default PersonalInfoForm;