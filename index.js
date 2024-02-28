/**
 * Компонент отображения формы ввода личных данных в создании/редактировании агента
 * from: ProfileInfo
 */
import React, { useEffect } from "react";
import PropTypes from "prop-types";

import withValidate from "../../utils/injectValidate";
import { validateInput } from "../../utils/validate";
import { EmptyNoBorder } from "../../CommonStyled";
import Subscribe from "../Subscribe";
import {
  Spinner,
} from "../../UiComponents";

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

  if (loading) return (
    <EmptyNoBorder>
      <Spinner />
    </EmptyNoBorder>
  );

  return (
    <>
      <PersonalInfoForm
        userInfo={userInfo}
        newUser={newUser}
        setValue={setValue}
        validate={validate}
        internalErrors={internalErrors}
        errorsServer={errorsServer}
        permissions={permissions}
      />
      <LegalInfoForm
        userInfo={userInfo}
        setValue={setValue}
        validate={validate}
        internalErrors={internalErrors}
        isJuridical={isJuridical}
        permissions={permissions}
        rejectSet={rejectSet}
      />
      <ContactInfoForm
        userInfo={userInfo}
        setValue={setValue}
        validate={validate}
        internalErrors={internalErrors}
        removeError={removeError}
        permissions={permissions}
        phoneVerification={phoneVerification}
        username={username}
        openModal={openModal}
        whatsApp={whatsApp}
        whatsAppSetNotifications={whatsAppSetNotifications}
      />
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
