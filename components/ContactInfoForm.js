import localStorage from '../../../utils/browser/localStorage';
import { WarningIcon, SuccessIcon } from '../../../Icons';
import { Input, SuggestionsInput, FormRow, Button, Range } from '../../../UiComponents';
import { MAGIC_STRINGS, LOCALES } from "./const";

export const ContactInfoForm = (props) => {
  const {
    userInfo,
    setValue,
    validate,
    internalErrors,
    removeError,
    permissions,
    phoneVerification,
    username,
    openModal,
    whatsApp,
    whatsAppSetNotifications,
  } = props;

  const sameUser = username === userInfo.username;
  const whatsAppEnabled = sameUser && whatsApp && whatsApp.bot_enabled;
  const userWorkHours = sameUser && userInfo.workHours;

  const phoneVerificationButton = sameUser && (
    <Button
      type={MAGIC_STRINGS.text}
      tooltip={phoneVerification ? LOCALES.phoneConfirmed : LOCALES.phoneNotConfirmed}
      mode={phoneVerification ? MAGIC_STRINGS.success : MAGIC_STRINGS.error}
      onClick={
        !localStorage.getSwitchUser() && !phoneVerification
        ? () => openModal(MAGIC_STRINGS.verificationPhoneModal)
        : () => null
      }
    >
      {phoneVerification ? <SuccessIcon /> : <WarningIcon />}
    </Button>
  );

  const whatsAppNotifyButton = (
    <Button
      inline
      onClick={(e) => {
        e.preventDefault();
        whatsAppSetNotifications(!whatsApp.notify_enabled);
      }}
    >
      {whatsApp.notify_enabled ? LOCALES.notifyWhatsappDisable : LOCALES.notifyWhatsappEnable}
    </Button>
  );
  const whatsAppBotButton = (
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
  );

  return (
    <>
      <FormRow>
        <Input
          id={MAGIC_STRINGS.email}
          label={LOCALES.email}
          size='lg'
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
          after={phoneVerificationButton}
        />
        {
          whatsAppEnabled
          && (whatsApp.bot_started ? whatsAppNotifyButton : whatsAppBotButton)
        }
        <SuggestionsInput
          id={MAGIC_STRINGS.address}
          label={LOCALES.address}
          placeholder={LOCALES.addressDefault}
          name={MAGIC_STRINGS.address}
          size='xl'
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
            rows='3'
            size='stretch'
            disabled={!permissions.editNote}
            value={userInfo.notes}
            onChange={(value) => setValue([MAGIC_STRINGS.userInfo, MAGIC_STRINGS.notes], value)}
          />
        </FormRow>
      )}
      {userWorkHours && (
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
    </>
  );
};

export default ContactInfoForm;
