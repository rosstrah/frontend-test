/**
 * Компонент отображения формы ввода личных данных в создании/редактировании агента
 * from: ProfileInfo
 */
import { React, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import withValidate from "../../utils/injectValidate";
import localStor from "../../utils/browser/localStorage";
import { validateInput } from "../../utils/validate";
import { EmptyNoBorder } from "../../CommonStyled";
import Subscribe from "../Subscribe";
import { DicesIcon, WarningIcon, SuccessIcon } from "../../Icons";
import {
  Input,
  DateInput,
  SuggestionsInput,
  RadioButtons,
  FormRow,
  Button,
  Spinner,
  Range,
} from "../../UiComponents";
import { generatePassword } from "./utils";
import { MAGIC_STRINGS, LOCALES, REGEXP, DATES_FORMAT } from "./const";

export const ProfileInfo = (props) => {
  const {
    userInfo,
    newUser,
    setValue,
    validate,
    internalErrors,
    errorsServer,
    removeError,
    loading,
    permissions,
    rejectSet,
    isJuridical,
    phoneVerification,
    username,
    openModal,
    subscribe,
    setSubscribe,
    whatsApp,
    whatsAppSetNotifications,
  } = props;

  useEffect(() => {
    if (!errorsServer && !errorsServer.isArray()) return null;

    errorsServer.forEach((elem) => {
      internalErrors[elem.key] = elem.message;
      if (elem.key === MAGIC_STRINGS.usernameCanonical) {
        internalErrors.username = elem.message;
      }
      if (elem.key === MAGIC_STRINGS.emailCanonical) {
        internalErrors.email = elem.message;
      }
    });
  }, [internalErrors, errorsServer]);

  const setIsJuridical = (value) => {
    if (permissions.editJuridical) {
      setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.isJuridical], value);
    } else {
      rejectSet(LOCALES.juridicalError);
    }
  };

  if (loading) return (
    <EmptyNoBorder>
      <Spinner />
    </EmptyNoBorder>
  );

  return (
    <>
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
      <FormRow>
        <Input
          id={MAGIC_STRINGS.email}
          label={LOCALES.email}
          size="lg"
          disabled={!permissions.editEmail}
          value={userInfo.email}
          onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.email], value)}
          onBlur={(value) => {
            validate(MAGIC_STRINGS.email, value);
          }}
          error={internalErrors.email}
        />
        <Input
          id={MAGIC_STRINGS.phone}
          label={LOCALES.phone}
          disabled={!permissions.editPhone}
          value={userInfo.phone}
          onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.phone], value)}
          onBlur={(value) => {
            validate(MAGIC_STRINGS.phone, value);
          }}
          error={internalErrors.phone}
          after={
            username === userInfo.username && (
              <Button
                type={MAGIC_STRINGS.text}
                tooltip={
                  phoneVerification
                    ? LOCALES.phoneConfirmed
                    : LOCALES.phoneNotConfirmed
                }
                mode={phoneVerification ? MAGIC_STRINGS.success : MAGIC_STRINGS.error}
                onClick={
                  localStor.getSwitchUser()
                    ? () => {}
                    : phoneVerification
                    ? (e) => e.preventDefault()
                    : (e) => {
                        e.preventDefault();
                        openModal(MAGIC_STRINGS.verificationPhoneModal);
                      }
                }
              >
                {phoneVerification ? <SuccessIcon /> : <WarningIcon />}
              </Button>
            )
          }
        />
        {username === userInfo.username &&
          whatsApp &&
          whatsApp.bot_enabled &&
          (whatsApp.bot_started ? (
            <Button
              inline
              onClick={(e) => {
                e.preventDefault();
                whatsAppSetNotifications(!whatsApp.notify_enabled);
              }}
            >
              {whatsApp.notify_enabled
                ? LOCALES.notifyWhatsappDisable
                : LOCALES.notifyWhatsappEnable}
            </Button>
          ) : (
            <Button
              inline
              onClick={() =>
                openModal(MAGIC_STRINGS.whatsAppAuthModal, {
                  link: whatsApp[MAGIC_STRINGS.redirect_url],
                })
              }
            >
              {LOCALES.whatsappBotEnable}
            </Button>
          ))}
        <SuggestionsInput
          id={MAGIC_STRINGS.address}
          label={LOCALES.address}
          placeholder={LOCALES.addressDefault}
          name={MAGIC_STRINGS.address}
          size="xl"
          value={userInfo.address}
          list={userInfo.addressList}
          keyName={MAGIC_STRINGS.text}
          onChange={setValue}
          onBlur={(address) => {
            validate(MAGIC_STRINGS.addressInProfile, address);
            removeError(MAGIC_STRINGS.addressInProfile);
          }}
          error={internalErrors.addressInProfile}
        />
      </FormRow>
      {permissions.editNote && (
        <FormRow>
          <Input
            id={MAGIC_STRINGS.description}
            label={LOCALES.remark}
            rows="3"
            size="stretch"
            disabled={!permissions.editNote}
            value={userInfo.notes}
            onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.notes], value)}
          />
        </FormRow>
      )}
      {username === userInfo.username && userInfo.workHours && (
        <>
          {LOCALES.workHours}
          <FormRow>
            <Range
              step={1}
              min={0}
              max={23}
              values={userInfo.workHours}
              onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.workHours], value)}
            />
          </FormRow>
        </>
      )}
      {permissions.editSubscribe && (
        <Subscribe values={subscribe} setValue={setSubscribe} />
      )}
    </>
  );
};

ProfileInfo.propTypes = {
  errorsServer: PropTypes.array,
  userInfo: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default withValidate(validateInput)(ProfileInfo);
