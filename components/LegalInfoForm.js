import React, { memo } from "react";
import moment from "moment";

import {
  Input,
  DateInput,
  RadioButtons,
  FormRow,
} from "../../../UiComponents";
import { MAGIC_STRINGS, LOCALES, REGEXP, DATES_FORMAT } from "./const";

export const LegalInfoForm = (props) => {
  const {
    userInfo,
    setValue,
    validate,
    internalErrors,
    isJuridical,
    permissions,
    rejectSet,
  } = props;

  const setIsJuridical = (value) => {
    if (permissions.editJuridical) {
      setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.isJuridical], value);
    } else {
      rejectSet(LOCALES.juridicalError);
    }
  };

  return (
    <FormRow>
      <RadioButtons
        id={MAGIC_STRINGS.isJuridical}
        value={isJuridical}
        list={[
          { title: LOCALES.physical, value: false },
          { title: LOCALES.juridical, value: true },
        ]}
        onChange={(value) => setIsJuridical(value)}
      />
      {isJuridical ? (
        <Input
          id={MAGIC_STRINGS.inn}
          label={LOCALES.inn}
          maxLength="12"
          value={userInfo.inn}
          onChange={(value) => {
            if (
              REGEXP.inn.test(value) ||
              value.length < userInfo.inn.length
            )
              return setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.inn], value);
          }}
        />
      ) : (
        <>
          <Input
            id={MAGIC_STRINGS.series}
            label={LOCALES.passportSerial}
            placeholder={LOCALES.passportSerialDefault}
            maxLength="4"
            size="xs"
            value={userInfo.series}
            onChange={(value) => {
              if (
                REGEXP.passportSerial.test(value) ||
                value.length < userInfo.series.length
              )
                return setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.series], value);
            }}
            onBlur={(value) => {
              validate(MAGIC_STRINGS.series, value, {
                documentType: MAGIC_STRINGS.passport,
              });
            }}
            error={internalErrors.series}
          />
          <Input
            id={MAGIC_STRINGS.number}
            label={LOCALES.passportNumber}
            placeholder={LOCALES.passportNumberDefault}
            maxLength="6"
            size="xs"
            value={userInfo.number}
            onChange={(value) => {
              if (
                REGEXP.passportNumber.test(value) ||
                value.length < userInfo.number.length
              )
                return setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.number], value);
            }}
            onBlur={(value) => {
              validate(MAGIC_STRINGS.number, value, {
                documentType: MAGIC_STRINGS.passport,
              });
            }}
            error={internalErrors.number}
          />
          <DateInput
            id={MAGIC_STRINGS.birthday}
            label={LOCALES.birthday}
            value={userInfo.birthday}
            onChange={(value) => {
              if (
                REGEXP.birthday.test(value) ||
                value.length < userInfo.birthday.length
              )
                return setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.birthday], value);
            }}
            onBlur={(value) => {
              validate(MAGIC_STRINGS.birthday, value);
              if (userInfo.issuedAt)
                validate(MAGIC_STRINGS.issuedAt, userInfo.issuedAt, {
                  documentType: MAGIC_STRINGS.passport,
                  birth: value,
                });
              if (moment(value, DATES_FORMAT.DDMMYYYY).isValid()) {
                setValue(
                  [MAGIC_STRINGS.userInfo, MAGIC_STRINGS.birthday],
                  moment(value, DATES_FORMAT.DDMMYYYY).format(DATES_FORMAT.DDMMYYYY)
                );
              }
            }}
            error={internalErrors.birthday}
          />
          <Input
            id={MAGIC_STRINGS.snils}
            label={LOCALES.snils}
            maxLength="11"
            value={userInfo.snils}
            onChange={(value) => {
              if (
                REGEXP.snils.test(value) ||
                value.length < userInfo.snils.length
              )
                return setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.snils], value);
            }}
          />
        </>
      )}
    </FormRow>
  );
};

export default memo(LegalInfoForm);